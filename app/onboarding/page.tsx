import Link from "next/link";
import { redirect } from "next/navigation";
import { setOnboardingRole } from "@/app/actions";
import { MarketingPage } from "@/components/marketing-page";
import { ensureUser } from "@/lib/user-sync";

export default async function OnboardingRolePage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");

  return (
    <MarketingPage title="Welcome to BuildLink" subtitle="Choose how you’ll use the platform. You can refine this later.">
      <form action={setOnboardingRole} className="flex flex-col gap-4">
        <p className="text-sm text-stone-600">I am a:</p>
        <div className="flex flex-wrap gap-3">
          <button type="submit" name="role" value="HOMEOWNER" className="rounded-xl border border-stone-300 bg-white px-6 py-4 text-left hover:border-stone-900">
            <span className="block font-semibold">Homeowner</span>
            <span className="text-sm text-stone-600">Post jobs and manage projects</span>
          </button>
          <button type="submit" name="role" value="BUILDER" className="rounded-xl border border-stone-300 bg-white px-6 py-4 text-left hover:border-stone-900">
            <span className="block font-semibold">Builder / tradesperson</span>
            <span className="text-sm text-stone-600">Quote, win work, and deliver on-site</span>
          </button>
        </div>
      </form>
      <p className="text-sm text-stone-500">
        Already know the flow? <Link href="/dashboard">Skip to dashboard</Link>
      </p>
    </MarketingPage>
  );
}
