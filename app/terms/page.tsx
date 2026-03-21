import { MarketingPage } from "@/components/marketing-page";

export const metadata = {
  title: "Terms | BuildLink",
};

export default function TermsPage() {
  return (
    <MarketingPage title="Terms of service" subtitle="Placeholder — obtain legal review for UK operations.">
      <p>
        BuildLink provides a platform to connect homeowners and builders. Users are responsible for the accuracy of listings and for
        complying with health & safety, contracts, and insurance requirements on site.
      </p>
      <p className="text-sm text-stone-600">This is placeholder content for development only.</p>
    </MarketingPage>
  );
}
