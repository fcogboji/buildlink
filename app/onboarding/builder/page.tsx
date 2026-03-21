import Link from "next/link";
import { redirect } from "next/navigation";
import { completeBuilderOnboarding } from "@/app/actions";
import { MarketingPage } from "@/components/marketing-page";
import { ensureUser } from "@/lib/user-sync";

export default async function BuilderOnboardingPage() {
  const user = await ensureUser("BUILDER");
  if (!user) redirect("/sign-in");

  return (
    <MarketingPage title="Builder profile" subtitle="Strong profiles get better matches. You can refine this anytime.">
      <form action={completeBuilderOnboarding} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Company / trading name</label>
          <input name="companyName" className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="e.g. Northstone Renovations Ltd" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Trades (comma-separated)</label>
          <input name="trades" required className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="plumbing, electrical, carpentry" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Service areas (postcodes or towns, comma-separated)</label>
          <input name="serviceAreas" required className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="N1, E2, Manchester" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Years experience</label>
            <input name="yearsExperience" type="number" min={0} className="w-full rounded-lg border border-stone-300 px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Typical availability</label>
            <input name="availability" className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="e.g. 4–6 weeks lead" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Certifications (comma-separated, optional)</label>
          <input name="certifications" className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="Gas Safe, NICEIC…" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Bio</label>
          <textarea name="bio" rows={4} className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="What projects do you love? What size jobs do you prefer?" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Portfolio video URL (optional)</label>
          <input name="portfolioVideoUrl" className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="https://…" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Portfolio image URLs (comma-separated)</label>
          <input name="portfolioImageUrls" className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="https://…" />
        </div>
        <button type="submit" className="rounded-xl bg-stone-900 px-5 py-3 text-white">
          Save profile & open job feed
        </button>
      </form>
      <p className="text-sm text-stone-600">
        <Link href="/onboarding" className="text-amber-800 underline">
          Change role
        </Link>
      </p>
    </MarketingPage>
  );
}
