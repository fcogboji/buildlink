import { MarketingPage } from "@/components/marketing-page";

export const metadata = {
  title: "Privacy | BuildLink",
};

export default function PrivacyPage() {
  return (
    <MarketingPage title="Privacy policy" subtitle="Summary — replace with your solicitor-reviewed policy before launch.">
      <p>
        We process account data (via Clerk), project data you provide, and usage data to run the service. Payments may be processed by
        Stripe. We do not sell personal data.
      </p>
      <p className="text-sm text-stone-600">This is placeholder content for development only.</p>
    </MarketingPage>
  );
}
