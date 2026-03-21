import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";
import { resolveDispute } from "@/app/actions";

export default async function AdminDisputesPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const disputedJobs = await prisma.job.findMany({
    where: { status: "DISPUTED" },
    include: { milestones: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <SiteHeader />
      <main className="container-app py-6 sm:py-8 pb-safe">
        <h1 className="text-3xl font-semibold">Dispute resolution</h1>
        <p className="mt-2 text-stone-600">Escrow and milestone evidence lowers conflict and speeds fair outcomes.</p>
        <div className="mt-6 space-y-3">
          {disputedJobs.length === 0 ? <article className="rounded-xl border border-stone-200 bg-white p-4 text-stone-600">No active disputes.</article> : null}
          {disputedJobs.map((job) => (
            <article key={job.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <p className="font-medium">{job.title}</p>
              <p className="text-sm text-stone-600">
                {job.postcode} · milestones: {job.milestones.length}
              </p>
              <form action={resolveDispute} className="mt-2">
                <input type="hidden" name="jobId" value={job.id} />
                <button type="submit" className="rounded-lg bg-stone-900 px-3 py-2 text-sm text-white">
                  Resolve and move to in-progress
                </button>
              </form>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
