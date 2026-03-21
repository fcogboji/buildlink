import Link from "next/link";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function HomeownerOverviewPage() {
  const user = await ensureUser();
  if (!user) return null;

  const jobs = await prisma.job.findMany({
    where: { homeownerId: user.id },
    include: { quotes: true, messages: true, milestones: true },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  const activeJobs = jobs.filter((j) => ["OPEN", "MATCHED", "IN_PROGRESS", "DISPUTED"].includes(j.status));
  const messageThreads = jobs.filter((j) => j.messages.length > 0).length;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-stone-900">Overview</h1>
      <p className="mt-2 text-stone-600">Your active projects, messages, and next actions.</p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Active jobs</p>
          <p className="mt-1 text-3xl font-semibold">{activeJobs.length}</p>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Jobs with messages</p>
          <p className="mt-1 text-3xl font-semibold">{messageThreads}</p>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Open quotes (total)</p>
          <p className="mt-1 text-3xl font-semibold">{jobs.reduce((n, j) => n + j.quotes.filter((q) => q.status === "PENDING").length, 0)}</p>
        </article>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <Link href="/dashboard/homeowner/jobs/new" className="text-sm text-amber-800 underline">
            Post job
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {jobs.slice(0, 5).map((j) => (
            <li key={j.id} className="rounded-xl border border-stone-200 bg-white px-4 py-3">
              <Link href={`/dashboard/homeowner/jobs/${j.id}`} className="font-medium text-stone-900 hover:underline">
                {j.title}
              </Link>
              <span className="ml-2 text-sm text-stone-500">{j.status}</span>
            </li>
          ))}
          {jobs.length === 0 ? <li className="text-stone-600">No jobs yet — create your first brief.</li> : null}
        </ul>
      </section>
    </div>
  );
}
