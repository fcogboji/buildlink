import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ensureUser } from "@/lib/user-sync";
import { getStripeClient, PRO_BUILDER_PRICE_ID } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * GET is not supported — checkout must be started with POST (e.g. from /pricing form).
 * Redirect so opening this URL in the browser doesn’t show 405.
 */
export async function GET() {
  return NextResponse.redirect(new URL("/pricing?checkout=open-from-pricing", appUrl()));
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", appUrl()));
  }

  const stripe = getStripeClient();
  if (!stripe || !PRO_BUILDER_PRICE_ID) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID." },
      { status: 400 },
    );
  }

  const dbUser = await ensureUser("BUILDER");
  if (!dbUser) {
    return NextResponse.json({ error: "Unable to resolve authenticated user." }, { status: 401 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: PRO_BUILDER_PRICE_ID, quantity: 1 }],
    success_url: `${appUrl()}/dashboard/builder/jobs/feed?subscribed=1`,
    cancel_url: `${appUrl()}/pricing?cancelled=1`,
    client_reference_id: dbUser.id,
    metadata: { clerkUserId: userId },
  });

  return NextResponse.redirect(session.url || `${appUrl()}/pricing`);
}
