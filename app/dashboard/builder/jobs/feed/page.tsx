import Link from "next/link";
import { redirect } from "next/navigation";
import { createQuote } from "@/app/actions";
import { scoreLeadFit } from "@/lib/matching";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/user-sync";

export default async function BuilderJobFeedPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");

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
    where: { status: { in: ["OPEN", "MATCHED"] } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const leads = jobs
    .map((job) => ({
      job,
      fit: scoreLeadFit(job, builderProfile.trades, builderProfile.specialties, builderProfile.serviceAreas),
    }))
    .sort((a, b) => b.fit.score - a.fit.score);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Job feed</h1>
      <p className="mt-2 text-stone-600">Ranked by fit — refine trades and service areas in your profile.</p>
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
