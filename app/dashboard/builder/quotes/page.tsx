import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function BuilderQuotesDashboardPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");

  const quotes = await prisma.quote.findMany({
    where: { builderId: user.id },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });

  const accepted = quotes.filter((q) => q.status === "ACCEPTED").length;
  const pending = quotes.filter((q) => q.status === "PENDING").length;
  const rejected = quotes.filter((q) => q.status === "REJECTED").length;
  const winRate = quotes.length === 0 ? 0 : Math.round((accepted / quotes.length) * 100);

  return (
    <div>
      <h1 className="text-3xl font-semibold">My bids / quotes</h1>
      <p className="mt-2 text-stone-600">Sent quotes and outcomes.</p>

      <section className="mt-6 grid gap-3 md:grid-cols-4">
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Pending</p>
          <p className="text-2xl font-semibold">{pending}</p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Accepted</p>
          <p className="text-2xl font-semibold">{accepted}</p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Rejected</p>
          <p className="text-2xl font-semibold">{rejected}</p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Win rate</p>
          <p className="text-2xl font-semibold">{winRate}%</p>
        </article>
      </section>

      <section className="mt-8 space-y-2">
        {quotes.length === 0 ? <article className="rounded-xl border border-stone-200 bg-white p-4 text-stone-600">No quotes yet.</article> : null}
        {quotes.map((quote) => (
          <article key={quote.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{quote.job.title}</p>
              <span className="text-xs uppercase text-stone-500">{quote.status}</span>
            </div>
            <p className="text-sm text-stone-600">
              £{quote.amount.toLocaleString()} · {quote.daysToComplete} days
            </p>
            <p className="mt-1 text-sm text-stone-700">{quote.introMessage}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
