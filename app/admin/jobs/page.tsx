import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { markJobDisputed } from "@/app/actions";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function AdminJobsPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div>
      <SiteHeader />
      <main className="container-app py-6 sm:py-8 pb-safe">
        <h1 className="text-3xl font-semibold">Job quality checks</h1>
        <p className="mt-2 text-stone-600">Flag vague briefs and low-intent posts to protect builder time.</p>
        <section className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-600">Rules: minimum scope details, realistic budget ranges, and timeline intent.</p>
        </section>
        <section className="mt-4 space-y-2">
          {jobs.map((job) => (
            <article key={job.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <p className="font-semibold">{job.title}</p>
              <p className="text-sm text-stone-600">
                {job.postcode} · £{job.budgetMin.toLocaleString()}-{job.budgetMax.toLocaleString()} · {job.status}
              </p>
              {job.status !== "DISPUTED" ? (
                <form action={markJobDisputed} className="mt-2">
                  <input type="hidden" name="jobId" value={job.id} />
                  <button type="submit" className="rounded-lg border border-amber-300 px-3 py-2 text-sm text-amber-800">
                    Flag for dispute review
                  </button>
                </form>
              ) : null}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
