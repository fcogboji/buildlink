import Link from "next/link";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function BuilderOverviewPage() {
  const user = await ensureUser();
  if (!user) return null;

  const openJobs = await prisma.job.count({
    where: { status: { in: ["OPEN", "MATCHED"] } },
  });

  const quotes = await prisma.quote.count({ where: { builderId: user.id } });
  const projects = await prisma.project.count({ where: { builderId: user.id, status: { in: ["ACTIVE", "PAUSED"] } } });

  const earnings = await prisma.payment.aggregate({
    where: {
      status: "RELEASED",
      project: { builderId: user.id },
    },
    _sum: { amount: true },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold text-stone-900">Builder overview</h1>
      <p className="mt-2 text-stone-600">Available work, your pipeline, and earnings snapshot.</p>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Open / matched jobs (market)</p>
          <p className="mt-1 text-3xl font-semibold">{openJobs}</p>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Quotes sent</p>
          <p className="mt-1 text-3xl font-semibold">{quotes}</p>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Active projects</p>
          <p className="mt-1 text-3xl font-semibold">{projects}</p>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Released payments (DB)</p>
          <p className="mt-1 text-3xl font-semibold">£{(earnings._sum.amount ?? 0).toLocaleString()}</p>
        </article>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/dashboard/builder/jobs/feed" className="rounded-xl bg-stone-900 px-4 py-2 text-white">
          Open job feed
        </Link>
        <Link href="/dashboard/builder/quotes" className="rounded-xl border border-stone-300 px-4 py-2">
          My quotes
        </Link>
      </div>
    </div>
  );
}
