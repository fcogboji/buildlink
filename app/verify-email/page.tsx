import Link from "next/link";
import { MarketingPage } from "@/components/marketing-page";

export const metadata = {
  title: "Verify email | BuildLink",
};

export default function VerifyEmailPage() {
  return (
    <MarketingPage title="Verify your email" subtitle="Check your inbox for a link from Clerk to activate your account.">
      <p>Didn’t get it? Check spam or request a new code from the sign-up flow.</p>
      <Link href="/sign-up" className="inline-block text-amber-800 underline">
        Back to sign up
      </Link>
    </MarketingPage>
  );
}
