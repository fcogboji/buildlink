import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { addMilestone, markJobDisputed } from "@/app/actions";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

type JobDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: JobDetailProps) {
  const user = await ensureUser("HOMEOWNER");
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      quotes: { include: { builder: true }, orderBy: { createdAt: "asc" } },
      milestones: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!job || job.homeownerId !== user.id) {
    notFound();
  }

  const totalEscrow = job.milestones.reduce((sum, m) => sum + m.amount, 0);

  return (
    <div>
      <SiteHeader />
      <main className="container-app py-6 sm:py-8 pb-safe">
        <h1 className="text-3xl font-semibold">Job detail: {job.title}</h1>
        <p className="mt-2 text-stone-600">Track quote status, milestones, and payments for this project.</p>

        <section className="mt-6 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm text-stone-500">Quotes received</p>
            <p className="text-2xl font-semibold">{job.quotes.length}</p>
          </article>
          <article className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm text-stone-500">Milestones complete</p>
            <p className="text-2xl font-semibold">
              {job.milestones.filter((m) => m.status === "PAID").length} / {job.milestones.length}
            </p>
          </article>
          <article className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm text-stone-500">Escrow protected</p>
            <p className="text-2xl font-semibold">£{totalEscrow.toLocaleString()}</p>
          </article>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-stone-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Builder quotes</h2>
            <div className="mt-3 space-y-2">
              {job.quotes.length === 0 ? <p className="text-sm text-stone-600">No quotes submitted yet.</p> : null}
              {job.quotes.map((quote) => (
                <div key={quote.id} className="rounded-lg border border-stone-200 p-3">
                  <p className="font-medium">{quote.builder.fullName || quote.builder.email}</p>
                  <p className="text-sm text-stone-600">
                    £{quote.amount.toLocaleString()} · {quote.daysToComplete} days
                  </p>
                  <p className="mt-1 text-sm text-stone-700">{quote.introMessage}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-stone-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Milestones</h2>
            <div className="mt-3 space-y-2">
              {job.milestones.length === 0 ? <p className="text-sm text-stone-600">No milestones added yet.</p> : null}
              {job.milestones.map((m) => (
                <div key={m.id} className="rounded-lg border border-stone-200 p-3 text-sm">
                  {m.title} · £{m.amount.toLocaleString()} · {m.status}
                </div>
              ))}
            </div>
            <form action={addMilestone} className="mt-4 grid gap-2">
              <input type="hidden" name="jobId" value={job.id} />
              <input name="title" required placeholder="Milestone title" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
              <input name="amount" required type="number" min={1} placeholder="Amount (£)" className="rounded-lg border border-stone-300 px-3 py-2 text-sm" />
              <button type="submit" className="rounded-lg bg-stone-900 px-3 py-2 text-sm text-white">
                Add milestone
              </button>
            </form>
          </article>
        </section>

        <form action={markJobDisputed} className="mt-5">
          <input type="hidden" name="jobId" value={job.id} />
          <button type="submit" className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50">
            Mark dispute for admin review
          </button>
        </form>
      </main>
    </div>
  );
}
