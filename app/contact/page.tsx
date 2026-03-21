import { MarketingPage } from "@/components/marketing-page";

export const metadata = {
  title: "Contact | BuildLink",
};

export default function ContactPage() {
  return (
    <MarketingPage title="Contact" subtitle="We’re early — reach out for pilots, partnerships, or product feedback.">
      <p>
        Email: <a href="mailto:hello@buildlink.co.uk" className="text-amber-800 underline">hello@buildlink.co.uk</a>
      </p>
      <p className="text-sm text-stone-600">Replace with your real address in production.</p>
    </MarketingPage>
  );
}
