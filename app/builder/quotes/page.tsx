import { SiteHeader } from "@/components/site-header";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function BuilderQuotesPage() {
  const user = await ensureUser("BUILDER");
  if (!user) redirect("/sign-in");

  const quotes = await prisma.quote.findMany({
    where: { builderId: user.id },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });

  const accepted = quotes.filter((q) => q.status === "ACCEPTED").length;
  const pending = quotes.filter((q) => q.status === "PENDING").length;
  const wonRate = quotes.length === 0 ? 0 : Math.round((accepted / quotes.length) * 100);

  return (
    <div>
      <SiteHeader />
      <main className="container-app py-6 sm:py-8 pb-safe">
        <h1 className="text-3xl font-semibold">Quote pipeline</h1>
        <p className="mt-2 text-stone-600">Track pending, accepted, and won jobs without losing context.</p>

        <section className="mt-6 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm text-stone-500">Pending quotes</p>
            <p className="text-2xl font-semibold">{pending}</p>
          </article>
          <article className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm text-stone-500">Accepted this month</p>
            <p className="text-2xl font-semibold">{accepted}</p>
          </article>
          <article className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm text-stone-500">Win rate</p>
            <p className="text-2xl font-semibold">{wonRate}%</p>
          </article>
        </section>

        <section className="mt-6 space-y-2">
          {quotes.length === 0 ? <article className="rounded-xl border border-stone-200 bg-white p-4 text-stone-600">No quotes submitted yet.</article> : null}
          {quotes.map((quote) => (
            <article key={quote.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <p className="font-semibold">{quote.job.title}</p>
              <p className="text-sm text-stone-600">
                £{quote.amount.toLocaleString()} · {quote.daysToComplete} days · {quote.status}
              </p>
              <p className="mt-1 text-sm text-stone-700">{quote.introMessage}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
