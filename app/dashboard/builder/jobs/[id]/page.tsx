import { notFound, redirect } from "next/navigation";
import { sendJobMessage } from "@/app/actions";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function BuilderJobWorkspacePage({ params }: Props) {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      project: true,
      homeowner: true,
      milestones: { orderBy: { createdAt: "asc" } },
      messages: { include: { sender: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!job || !job.project || job.project.builderId !== user.id) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">{job.title}</h1>
      <p className="mt-2 text-stone-600">
        {job.postcode} · Homeowner: {job.homeowner.fullName || job.homeowner.email} · {job.status}
      </p>

      <section className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Milestones</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {job.milestones.map((m) => (
            <li key={m.id}>
              {m.title} — £{m.amount.toLocaleString()} ({m.status})
            </li>
          ))}
          {job.milestones.length === 0 ? <li className="text-stone-600">No milestones yet.</li> : null}
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-lg bg-stone-50 p-3">
          {job.messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className="font-medium">{msg.sender.fullName || msg.sender.email}</span>
              <span className="text-stone-500"> · {new Date(msg.createdAt).toLocaleString()}</span>
              <p>{msg.body}</p>
            </div>
          ))}
        </div>
        <form action={sendJobMessage} className="mt-3 flex flex-col gap-2">
          <input type="hidden" name="jobId" value={job.id} />
          <textarea name="body" required rows={3} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" placeholder="Message the homeowner…" />
          <button type="submit" className="w-fit rounded-lg bg-stone-900 px-3 py-2 text-sm text-white">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
