import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

type BuilderQuotesDashboardPageProps = {
  searchParams?: Promise<{
    status?: "ALL" | "PENDING" | "ACCEPTED" | "REJECTED";
    sort?: "newest" | "oldest" | "amount_high" | "amount_low";
    q?: string;
  }>;
};

export default async function BuilderQuotesDashboardPage({ searchParams }: BuilderQuotesDashboardPageProps) {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  const params = (await searchParams) ?? {};
  const status = params.status || "ALL";
  const sort = params.sort || "newest";
  const q = (params.q || "").trim();

  let orderBy: { createdAt?: "asc" | "desc"; amount?: "asc" | "desc" } = { createdAt: "desc" };
  if (sort === "oldest") orderBy = { createdAt: "asc" };
  if (sort === "amount_high") orderBy = { amount: "desc" };
  if (sort === "amount_low") orderBy = { amount: "asc" };

  const quotes = await prisma.quote.findMany({
    where: {
      builderId: user.id,
      ...(status !== "ALL" ? { status } : {}),
      ...(q
        ? {
            job: {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { postcode: { contains: q, mode: "insensitive" } },
              ],
            },
          }
        : {}),
    },
    include: { job: true },
    orderBy,
  });

  const accepted = quotes.filter((q) => q.status === "ACCEPTED").length;
  const pending = quotes.filter((q) => q.status === "PENDING").length;
  const rejected = quotes.filter((q) => q.status === "REJECTED").length;
  const winRate = quotes.length === 0 ? 0 : Math.round((accepted / quotes.length) * 100);

  return (
    <div>
      <h1 className="text-3xl font-semibold">My bids / quotes</h1>
      <p className="mt-2 text-stone-600">Sent quotes and outcomes.</p>
      <form method="GET" className="mt-5 grid gap-2 rounded-xl border border-stone-200 bg-white p-4 md:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by job title/postcode"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm md:col-span-2"
        />
        <select name="status" defaultValue={status} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select name="sort" defaultValue={sort} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="amount_high">Amount high to low</option>
          <option value="amount_low">Amount low to high</option>
        </select>
        <div className="flex gap-2 md:col-span-4">
          <button type="submit" className="rounded-lg bg-stone-900 px-3 py-2 text-sm text-white">
            Apply filters
          </button>
          <Link href="/dashboard/builder/quotes" className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700">
            Reset
          </Link>
        </div>
      </form>

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
