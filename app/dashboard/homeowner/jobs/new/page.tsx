import Link from "next/link";
import { createJob } from "@/app/actions";

type HomeownerNewJobPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function HomeownerNewJobPage({ searchParams }: HomeownerNewJobPageProps) {
  const error = ((await searchParams) ?? {}).error || "";
  return (
    <div>
      <h1 className="text-3xl font-semibold">Post a job</h1>
      <p className="mt-2 text-stone-600">Clear briefs get better matches and fewer time-wasters.</p>
      {error === "rate_limit_create_job" ? (
        <article className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          You have reached the hourly job-post limit. Please try again later.
        </article>
      ) : null}

      <form action={createJob} className="mt-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm text-stone-600">Project title</label>
          <input name="title" required className="w-full rounded-lg border border-stone-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-stone-600">Description</label>
          <textarea name="description" required className="min-h-28 w-full rounded-lg border border-stone-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-stone-600">Property type (optional)</label>
          <input name="propertyType" className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="e.g. Victorian terrace" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input name="postcode" required className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Postcode" />
          <input name="timelineWeeks" type="number" min={1} className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Timeline (weeks)" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input name="budgetMin" type="number" min={1} required className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Budget min (£)" />
          <input name="budgetMax" type="number" min={1} required className="rounded-lg border border-stone-300 px-3 py-2" placeholder="Budget max (£)" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-stone-600">Image URLs (optional, comma-separated)</label>
          <input name="imageUrls" className="w-full rounded-lg border border-stone-300 px-3 py-2" />
        </div>
        <button type="submit" className="rounded-xl bg-stone-900 px-4 py-2 text-white">
          Publish job
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-600">
        Prefer guided setup? <Link href="/onboarding/homeowner">Use onboarding</Link>
      </p>
    </div>
  );
}
