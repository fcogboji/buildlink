import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function AdminAnalyticsPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const [users, jobs, quotes, payments] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.quote.count(),
    prisma.payment.aggregate({ _sum: { amount: true } }),
  ]);

  const completedJobs = await prisma.job.count({ where: { status: "COMPLETED" } });

  return (
    <div>
      <SiteHeader />
      <main className="container-app py-6 sm:py-8 pb-safe">
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <p className="mt-2 text-stone-600">High-level KPIs — extend with time series and revenue recognition.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Users</p>
            <p className="text-3xl font-semibold">{users}</p>
          </article>
          <article className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Jobs</p>
            <p className="text-3xl font-semibold">{jobs}</p>
          </article>
          <article className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Quotes</p>
            <p className="text-3xl font-semibold">{quotes}</p>
          </article>
          <article className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">GMV (sum of payment rows)</p>
            <p className="text-3xl font-semibold">£{(payments._sum.amount ?? 0).toLocaleString()}</p>
          </article>
        </div>
        <p className="mt-6 text-sm text-stone-600">Completed jobs: {completedJobs}</p>
      </main>
    </div>
  );
}
