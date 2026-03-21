import Stripe from "stripe";

export const PRO_BUILDER_PRICE_ID = process.env.STRIPE_PRICE_ID || "";

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
  });
}
