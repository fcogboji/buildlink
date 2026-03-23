import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma, SubscriptionStatus } from "@prisma/client";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";

export const dynamic = "force-dynamic";

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "incomplete":
      return "INCOMPLETE";
    case "incomplete_expired":
      return "INCOMPLETE_EXPIRED";
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
      return "CANCELED";
    case "unpaid":
      return "UNPAID";
    case "paused":
      return "PAUSED";
    default:
      return "NONE";
  }
}

function toDate(unixSeconds: number | null | undefined) {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000);
}

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const itemEnds = subscription.items.data
    .map((item) => item.current_period_end)
    .filter((v): v is number => typeof v === "number");
  if (itemEnds.length === 0) return null;
  return toDate(Math.max(...itemEnds));
}

async function syncSubscriptionByUserId(
  userId: string,
  subscription: Stripe.Subscription,
  customerId: string | null,
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionStatus: mapStripeStatus(subscription.status),
      stripePriceId: subscription.items.data[0]?.price?.id ?? null,
      stripeCurrentPeriodEnd: getSubscriptionPeriodEnd(subscription),
      stripeSubscriptionUpdatedAt: new Date(),
    },
  });
}

async function syncSubscriptionByStripeRefs(subscription: Stripe.Subscription, customerId: string | null) {
  const whereBySubId = { stripeSubscriptionId: subscription.id };
  const whereByCustomerId = customerId ? { stripeCustomerId: customerId } : null;
  const data = {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripeSubscriptionStatus: mapStripeStatus(subscription.status),
    stripePriceId: subscription.items.data[0]?.price?.id ?? null,
    stripeCurrentPeriodEnd: getSubscriptionPeriodEnd(subscription),
    stripeSubscriptionUpdatedAt: new Date(),
  };

  const updated = await prisma.user.updateMany({ where: whereBySubId, data });
  if (updated.count > 0) return;
  if (whereByCustomerId) {
    await prisma.user.updateMany({ where: whereByCustomerId, data });
  }
}

function isPrismaUniqueError(err: unknown) {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

export async function POST(req: Request) {
  const signature = (await headers()).get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = getStripeClient();

  if (!signature || !secret || !stripe) {
    return NextResponse.json({ error: "Missing webhook configuration." }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    await prisma.stripeWebhookEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
      },
    });
  } catch (err) {
    if (isPrismaUniqueError(err)) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    throw err;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode !== "subscription") {
      return NextResponse.json({ received: true });
    }

    const customerId = typeof session.customer === "string" ? session.customer : null;
    const appUserId = session.client_reference_id || session.metadata?.appUserId || null;
    const clerkUserId = session.metadata?.clerkUserId || null;

    let dbUserId: string | null = appUserId;
    if (!dbUserId && clerkUserId) {
      const user = await prisma.user.findUnique({
        where: { clerkUserId },
        select: { id: true },
      });
      dbUserId = user?.id ?? null;
    }

    if (!dbUserId) {
      return NextResponse.json({ received: true, ignored: "missing_user_reference" });
    }

    if (!session.subscription || typeof session.subscription !== "string") {
      await prisma.user.update({
        where: { id: dbUserId },
        data: {
          stripeCustomerId: customerId,
          stripeSubscriptionUpdatedAt: new Date(),
        },
      });
      return NextResponse.json({ received: true });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    await syncSubscriptionByUserId(dbUserId, subscription, customerId);
    return NextResponse.json({ received: true });
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
    await syncSubscriptionByStripeRefs(subscription, customerId);
    return NextResponse.json({ received: true });
  }

  if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const parentSub = invoice.parent?.subscription_details?.subscription;
    const subscriptionId = typeof parentSub === "string" ? parentSub : null;
    if (!subscriptionId) {
      return NextResponse.json({ received: true, ignored: "missing_subscription" });
    }
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
    await syncSubscriptionByStripeRefs(subscription, customerId);
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
