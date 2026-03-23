import type { SubscriptionStatus } from "@prisma/client";

const ACTIVE_BUILDER_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ["ACTIVE", "TRIALING"];

export function isBuilderSubscriptionActive(status: SubscriptionStatus) {
  return ACTIVE_BUILDER_SUBSCRIPTION_STATUSES.includes(status);
}

export function getSubscriptionStatusCopy(status: SubscriptionStatus) {
  switch (status) {
    case "ACTIVE":
      return "Your BuildLink Pro subscription is active.";
    case "TRIALING":
      return "Your trial is active. You have full builder access.";
    case "PAST_DUE":
      return "Payment is overdue. Update billing to restore full builder access.";
    case "CANCELED":
      return "Your subscription was canceled. Reactivate to continue using builder tools.";
    case "UNPAID":
      return "Your subscription is unpaid. Resume payments to unlock builder tools.";
    case "INCOMPLETE":
      return "Checkout is incomplete. Complete payment to unlock builder tools.";
    case "INCOMPLETE_EXPIRED":
      return "Previous checkout expired. Start a new checkout to unlock builder tools.";
    case "PAUSED":
      return "Your subscription is paused. Resume to unlock builder tools.";
    case "NONE":
    default:
      return "Start your subscription to unlock premium builder workspace features.";
  }
}
