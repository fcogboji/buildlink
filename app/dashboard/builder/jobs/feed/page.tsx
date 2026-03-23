import Link from "next/link";
import { redirect } from "next/navigation";
import { createQuote } from "@/app/actions";
import { scoreLeadFit } from "@/lib/matching";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/user-sync";

type BuilderJobFeedPageProps = {
  searchParams?: Promise<{
    q?: string;
    postcode?: string;
    minBudget?: string;
    maxBudget?: string;
    status?: "OPEN" | "MATCHED" | "ALL";
    sort?: "fit" | "newest" | "budget_high" | "budget_low";
    error?: string;
  }>;
};

function toInt(value: string | undefined) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : null;
}

export default async function BuilderJobFeedPage({ searchParams }: BuilderJobFeedPageProps) {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  const params = (await searchParams) ?? {};
  const q = (params.q || "").trim();
  const postcode = (params.postcode || "").trim().toUpperCase();
  const minBudget = toInt(params.minBudget);
  const maxBudget = toInt(params.maxBudget);
  const status = params.status || "ALL";
  const sort = params.sort || "fit";
  const error = params.error || "";

  const builderProfile = await prisma.builderProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      companyName: user.fullName || "New Builder Profile",
      serviceAreas: [],
      trades: [],
      specialties: [],
      certifications: [],
      portfolioImageUrls: [],
    },
  });

  const jobs = await prisma.job.findMany({
    where: {
      status: status === "ALL" ? { in: ["OPEN", "MATCHED"] } : status,
      ...(postcode ? { postcode: { startsWith: postcode } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(minBudget !== null ? { budgetMax: { gte: minBudget } } : {}),
      ...(maxBudget !== null ? { budgetMin: { lte: maxBudget } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const leadsBase = jobs.map((job) => ({
    job,
    fit: scoreLeadFit(job, builderProfile.trades, builderProfile.specialties, builderProfile.serviceAreas),
  }));
  const leads = [...leadsBase].sort((a, b) => {
    if (sort === "newest") return b.job.createdAt.getTime() - a.job.createdAt.getTime();
    if (sort === "budget_high") return b.job.budgetMax - a.job.budgetMax;
    if (sort === "budget_low") return a.job.budgetMin - b.job.budgetMin;
    return b.fit.score - a.fit.score;
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Job feed</h1>
      <p className="mt-2 text-stone-600">Ranked by fit — refine trades and service areas in your profile.</p>
      {error === "rate_limit_create_quote" ? (
        <article className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Too many quote submissions in a short period. Please wait a bit and try again.
        </article>
      ) : null}
      <form method="GET" className="mt-5 grid gap-2 rounded-xl border border-stone-200 bg-white p-4 md:grid-cols-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search title/description"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm md:col-span-2"
        />
        <input name="postcode" defaultValue={postcode} placeholder="Postcode" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
        <input
          name="minBudget"
          defaultValue={minBudget ?? ""}
          type="number"
          min={0}
          placeholder="Min budget"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <input
          name="maxBudget"
          defaultValue={maxBudget ?? ""}
          type="number"
          min={0}
          placeholder="Max budget"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <select name="status" defaultValue={status} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
          <option value="ALL">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="MATCHED">Matched</option>
        </select>
        <select name="sort" defaultValue={sort} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
          <option value="fit">Best fit</option>
          <option value="newest">Newest first</option>
          <option value="budget_high">Highest budget</option>
          <option value="budget_low">Lowest budget</option>
        </select>
        <div className="flex gap-2 md:col-span-6">
          <button type="submit" className="rounded-lg bg-stone-900 px-3 py-2 text-sm text-white">
            Apply filters
          </button>
          <Link href="/dashboard/builder/jobs/feed" className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700">
            Reset
          </Link>
        </div>
      </form>
      <div className="mt-6 grid gap-3">
        {leads.length === 0 ? (
          <article className="rounded-xl border border-stone-200 bg-white p-4 text-stone-600">No open leads right now.</article>
        ) : null}
        {leads.map((lead) => (
          <article key={lead.job.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{lead.job.title}</h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-900">{lead.fit.label}</span>
            </div>
            <p className="mt-2 text-sm text-stone-600">
              {lead.job.postcode} · £{lead.job.budgetMin.toLocaleString()}-{lead.job.budgetMax.toLocaleString()} · score {lead.fit.score}
            </p>
            <p className="mt-2 text-sm text-stone-700">{lead.job.description}</p>
            <form action={createQuote} className="mt-3 grid gap-2 md:grid-cols-4">
              <input type="hidden" name="jobId" value={lead.job.id} />
              <input required name="amount" type="number" min={1} placeholder="Quote £" className="rounded-lg border border-stone-300 px-2 py-1 text-sm" />
              <input required name="daysToComplete" type="number" min={1} placeholder="Days" className="rounded-lg border border-stone-300 px-2 py-1 text-sm" />
              <input required name="introMessage" placeholder="Short intro" className="rounded-lg border border-stone-300 px-2 py-1 text-sm md:col-span-2" />
              <button type="submit" className="rounded-lg bg-stone-900 px-3 py-2 text-sm text-white md:col-span-4">
                Submit quote
              </button>
            </form>
          </article>
        ))}
      </div>
      <Link href="/pricing" className="mt-6 inline-flex rounded-xl bg-stone-900 px-4 py-2 text-white">
        Builder subscription
      </Link>
    </div>
  );
}
