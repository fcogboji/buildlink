import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function HomeownerPaymentsPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");

  const jobs = await prisma.job.findMany({
    where: { homeownerId: user.id },
    include: {
      milestones: { include: { payment: true } },
      project: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Payments & escrow</h1>
      <p className="mt-2 text-stone-600">
        Milestones define escrow chunks. Production: Stripe Connect holds funds per milestone; this view tracks DB state.
      </p>

      <div className="mt-8 space-y-6">
        {jobs.map((job) => (
          <section key={job.id} className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <Link href={`/dashboard/homeowner/jobs/${job.id}`} className="text-sm text-amber-800 underline">
                Open job
              </Link>
            </div>
            <p className="text-sm text-stone-600">Status: {job.status} · Escrow enabled: {job.escrowEnabled ? "yes" : "no"}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {job.milestones.map((m) => (
                <li key={m.id} className="flex flex-wrap justify-between gap-2 border-t border-stone-100 pt-2">
                  <span>
                    {m.title} — £{m.amount.toLocaleString()} ({m.status})
                  </span>
                  <span className="text-stone-500">{m.payment ? `Payment: ${m.payment.status}` : "No Stripe PI yet"}</span>
                </li>
              ))}
              {job.milestones.length === 0 ? <li className="text-stone-600">No milestones — add them on the job.</li> : null}
            </ul>
          </section>
        ))}
        {jobs.length === 0 ? <p className="text-stone-600">No jobs yet.</p> : null}
      </div>
    </div>
  );
}
