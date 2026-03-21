import Link from "next/link";
import { MarketingPage } from "@/components/marketing-page";

export const metadata = {
  title: "Forgot password | BuildLink",
};

export default function ForgotPasswordPage() {
  return (
    <MarketingPage title="Reset password" subtitle="Clerk handles secure password reset from the sign-in screen.">
      <p>
        Go to <Link href="/sign-in" className="text-amber-800 underline">Sign in</Link> and use the forgot password link on the Clerk
        form.
      </p>
    </MarketingPage>
  );
}
