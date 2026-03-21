import Link from "next/link";
import { MarketingPage } from "@/components/marketing-page";

export const metadata = {
  title: "For homeowners | BuildLink",
  description: "Hire verified builders with structured quotes, milestones, and dispute support.",
};

export default function ForHomeownersPage() {
  return (
    <MarketingPage
      title="Less stress, clearer delivery"
      subtitle="From first brief to final payment — with a platform that stays with the job."
    >
      <ul className="list-disc space-y-3 pl-5">
        <li>Structured job briefs improve match quality</li>
        <li>Compare quotes in context</li>
        <li>Milestones and messages keep everyone aligned</li>
        <li>Dispute path when things go wrong</li>
      </ul>
      <Link href="/onboarding/homeowner" className="inline-block rounded-xl bg-stone-900 px-5 py-3 text-white">
        Start your project
      </Link>
    </MarketingPage>
  );
}
