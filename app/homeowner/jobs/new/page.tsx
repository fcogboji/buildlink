import { SiteHeader } from "@/components/site-header";
import { createJob } from "@/app/actions";

export default function NewJobPage() {
  return (
    <div>
      <SiteHeader />
      <main className="container-app max-w-3xl py-6 sm:py-8 pb-safe">
        <h1 className="text-3xl font-semibold">Post a job</h1>
        <p className="mt-2 text-stone-600">Smart matching works best when your brief is specific and realistic.</p>

        <form action={createJob} className="mt-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
          <div>
            <label className="mb-1 block text-sm text-stone-600">Project title</label>
            <input name="title" required className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="e.g. Rear extension + kitchen remodel" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-stone-600">Description</label>
            <textarea name="description" required className="min-h-28 w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="Scope, constraints, property type, planning state..." />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input name="postcode" required className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Postcode" />
            <input name="timelineWeeks" type="number" min={1} className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Timeline (weeks)" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input name="budgetMin" type="number" min={1} required className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Budget min (£)" />
            <input name="budgetMax" type="number" min={1} required className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Budget max (£)" />
          </div>
          <button type="submit" className="rounded-xl bg-stone-900 px-4 py-2 text-white">
            Publish job
          </button>
        </form>
      </main>
    </div>
  );
}
