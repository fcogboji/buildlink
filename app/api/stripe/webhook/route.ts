import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";

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

  if (event.type === "checkout.session.completed") {
    // Persist subscription state in DB here (MVP placeholder).
  }

  return NextResponse.json({ received: true });
}
