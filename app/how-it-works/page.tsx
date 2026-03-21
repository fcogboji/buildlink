import { MarketingPage } from "@/components/marketing-page";

export const metadata = {
  title: "How it works | BuildLink",
  description: "Post jobs, get matched, manage milestones and payments with BuildLink.",
};

export default function HowItWorksPage() {
  return (
    <MarketingPage
      title="How BuildLink works"
      subtitle="Four connected systems: acquisition, marketplace, project management, and payments with trust."
    >
      <ol className="list-decimal space-y-4 pl-5">
        <li>
          <strong>Post a clear job</strong> — scope, budget, postcode, and timeline so matching is accurate.
        </li>
        <li>
          <strong>Get matched builders</strong> — not a spam directory; fit scoring reduces junk leads.
        </li>
        <li>
          <strong>Hire and run the project</strong> — quotes, milestones, messages, and evidence in one place.
        </li>
        <li>
          <strong>Pay with confidence</strong> — milestone-based releases (Stripe Connect + escrow in rollout).
        </li>
      </ol>
      <p className="pt-4 text-sm text-stone-600">
        Unlike generic lead marketplaces, BuildLink is built for UK construction reality: trust, delivery, and fair economics for trades.
      </p>
    </MarketingPage>
  );
}
