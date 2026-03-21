import Link from "next/link";
import { MarketingPage } from "@/components/marketing-page";

export const metadata = {
  title: "For builders | BuildLink",
  description: "Quality leads, fair pricing, quotes pipeline, and project tools for UK trades.",
};

export default function ForBuildersPage() {
  return (
    <MarketingPage
      title="Built for builders who hate junk leads"
      subtitle="Win on fit and delivery — not on buying random phone numbers."
    >
      <ul className="list-disc space-y-3 pl-5">
        <li>Smart-matched job feed (not pay-per-lead roulette)</li>
        <li>Quote pipeline and win-rate visibility</li>
        <li>Projects, milestones, and messaging in one workspace</li>
        <li>Verification and reputation that actually mean something</li>
      </ul>
      <Link href="/sign-up" className="inline-block rounded-xl bg-stone-900 px-5 py-3 text-white">
        Join as a builder
      </Link>
    </MarketingPage>
  );
}
