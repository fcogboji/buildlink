import { MarketingPage } from "@/components/marketing-page";

export const metadata = {
  title: "About | BuildLink",
};

export default function AboutPage() {
  return (
    <MarketingPage
      title="About BuildLink"
      subtitle="We’re building a UK-first construction marketplace that optimises for delivery, not directory listings."
    >
      <p>
        The market for “find a tradesperson” is crowded — but trust, matching quality, and post-hire workflow are still broken. BuildLink
        focuses on systems that keep homeowners and builders aligned after the introduction.
      </p>
    </MarketingPage>
  );
}
