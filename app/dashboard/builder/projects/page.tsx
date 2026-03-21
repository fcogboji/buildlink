import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function BuilderProjectsPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");

  const projects = await prisma.project.findMany({
    where: { builderId: user.id },
    include: {
      job: { include: { milestones: true, homeowner: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="mt-2 text-stone-600">Active work, milestones, and deliverables.</p>
      <ul className="mt-6 space-y-3">
        {projects.map((p) => (
          <li key={p.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{p.job.title}</p>
              <span className="text-xs uppercase text-stone-500">{p.status}</span>
            </div>
            <p className="text-sm text-stone-600">
              Homeowner: {p.job.homeowner.fullName || p.job.homeowner.email} · {p.job.postcode}
            </p>
            <p className="mt-2 text-sm text-stone-700">Milestones: {p.job.milestones.length}</p>
            <Link href={`/dashboard/builder/jobs/${p.job.id}`} className="mt-2 inline-block text-sm text-amber-800 underline">
              Open project workspace
            </Link>
          </li>
        ))}
        {projects.length === 0 ? <li className="text-stone-600">No active projects — win a quote first.</li> : null}
      </ul>
    </div>
  );
}
