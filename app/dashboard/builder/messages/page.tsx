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
  const threadStates = await prisma.messageThreadState.findMany({
    where: { userId: user.id, jobId: { in: projects.map((p) => p.job.id) } },
    select: { jobId: true, lastReadAt: true },
  });
  const byJobId = new Map(threadStates.map((s) => [s.jobId, s.lastReadAt]));
  const rows = projects
    .map((p) => {
      const last = p.job.messages[0];
      const lastReadAt = byJobId.get(p.job.id);
      const unread = !!last && last.senderId !== user.id && (!lastReadAt || last.createdAt > lastReadAt);
      return { project: p, last, unread };
    })
    .sort((a, b) => Number(b.unread) - Number(a.unread) || (b.last?.createdAt?.getTime() ?? 0) - (a.last?.createdAt?.getTime() ?? 0));
  const unreadCount = rows.filter((r) => r.unread).length;

  return (
    <div>
      <h1 className="text-3xl font-semibold">Messages</h1>
      <p className="mt-2 text-stone-600">
        Threads for jobs you’re assigned to.
        {unreadCount > 0 ? ` ${unreadCount} unread.` : " All caught up."}
      </p>
      <ul className="mt-6 space-y-3">
        {rows.map(({ project, last, unread }) => (
          <li key={project.id} className={`rounded-xl border bg-white p-4 ${unread ? "border-amber-300" : "border-stone-200"}`}>
            <div className="flex items-center justify-between gap-3">
              <Link href={`/dashboard/builder/jobs/${project.job.id}`} className="font-semibold text-stone-900 hover:underline">
                {project.job.title}
              </Link>
              {unread ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">Unread</span> : null}
            </div>
            <p className="mt-1 text-sm text-stone-700">
              {last ? `"${last.body.slice(0, 100)}${last.body.length > 100 ? "..." : ""}"` : "No messages yet."}
            </p>
            <p className="text-xs text-stone-500">
              {last ? `Last message ${new Date(last.createdAt).toLocaleString()}` : ""}
            </p>
            <Link href={`/dashboard/builder/jobs/${project.job.id}`} className="mt-2 inline-flex text-sm font-medium text-amber-800 hover:underline">
              Open thread
            </Link>
          </li>
        ))}
        {rows.length === 0 ? <li className="text-stone-600">No assigned projects yet.</li> : null}
      </ul>
    </div>
  );
}
