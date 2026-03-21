import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function BuilderMessagesPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");

  const projects = await prisma.project.findMany({
    where: { builderId: user.id },
    include: {
      job: {
        include: {
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Messages</h1>
      <p className="mt-2 text-stone-600">Threads for jobs you’re assigned to.</p>
      <ul className="mt-6 space-y-3">
        {projects.map((p) => (
          <li key={p.id} className="rounded-xl border border-stone-200 bg-white p-4">
            <Link href={`/dashboard/builder/jobs/${p.job.id}`} className="font-semibold text-stone-900 hover:underline">
              {p.job.title}
            </Link>
            <p className="text-sm text-stone-600">
              {p.job.messages[0]
                ? `Last message ${new Date(p.job.messages[0].createdAt).toLocaleString()}`
                : "No messages yet."}
            </p>
          </li>
        ))}
        {projects.length === 0 ? <li className="text-stone-600">No assigned projects yet.</li> : null}
      </ul>
    </div>
  );
}
