import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function HomeownerJobsPage() {
  const user = await ensureUser("HOMEOWNER");
  if (!user) redirect("/sign-in");

  const jobs = await prisma.job.findMany({
    where: { homeownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <SiteHeader />
      <main className="container-app py-6 sm:py-8 pb-safe">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Your jobs</h1>
          <Link href="/homeowner/jobs/new" className="rounded-xl bg-stone-900 px-4 py-2 text-white">
            Post new job
          </Link>
        </div>
        <div className="mt-6 grid gap-3">
          {jobs.length === 0 ? (
            <article className="rounded-xl border border-stone-200 bg-white p-4 text-stone-600">
              No jobs yet. Post your first project to start receiving matched builders.
            </article>
          ) : null}
          {jobs.map((job) => (
            <Link key={job.id} href={`/homeowner/jobs/${job.id}`} className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
              <p className="text-lg font-semibold">{job.title}</p>
              <p className="text-sm text-stone-600">
                {job.postcode} · £{job.budgetMin.toLocaleString()} - £{job.budgetMax.toLocaleString()} · {job.status}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
