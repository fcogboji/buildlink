import Link from "next/link";
import { redirect } from "next/navigation";
import { completeHomeownerOnboarding } from "@/app/actions";
import { MarketingPage } from "@/components/marketing-page";
import { ensureUser } from "@/lib/user-sync";

export default async function HomeownerOnboardingPage() {
  const user = await ensureUser("HOMEOWNER");
  if (!user) redirect("/sign-in");

  return (
    <MarketingPage
      title="Tell us about your job"
      subtitle="This becomes your first job post — you can edit details later."
    >
      <form action={completeHomeownerOnboarding} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">What do you need done?</label>
          <input name="title" required className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="e.g. Kitchen extension" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Property type</label>
          <select name="propertyType" className="w-full rounded-lg border border-stone-300 px-3 py-2">
            <option value="">Select…</option>
            <option value="terraced">Terraced</option>
            <option value="semi-detached">Semi-detached</option>
            <option value="detached">Detached</option>
            <option value="flat">Flat / apartment</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Budget min (£)</label>
            <input name="budgetMin" type="number" min={1} required className="w-full rounded-lg border border-stone-300 px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Budget max (£)</label>
            <input name="budgetMax" type="number" min={1} required className="w-full rounded-lg border border-stone-300 px-3 py-2" />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Postcode</label>
            <input name="postcode" required className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="e.g. SW1A 1AA" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Timeline (weeks)</label>
            <input name="timelineWeeks" type="number" min={1} className="w-full rounded-lg border border-stone-300 px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
          <textarea name="description" required rows={5} className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="Scope, access, planning, materials…" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Image URLs (optional, comma-separated)</label>
          <input name="imageUrls" className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="https://… , https://…" />
        </div>
        <button type="submit" className="rounded-xl bg-stone-900 px-5 py-3 text-white">
          Create job & go to dashboard
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
