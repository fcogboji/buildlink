import { notFound, redirect } from "next/navigation";
import { acceptQuote, addMilestone, markJobDisputed, sendJobMessage } from "@/app/actions";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function HomeownerJobDetailPage({ params }: Props) {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      quotes: { include: { builder: { include: { builderProfile: true } } }, orderBy: { createdAt: "asc" } },
      milestones: { include: { payment: true }, orderBy: { createdAt: "asc" } },
      messages: { include: { sender: true }, orderBy: { createdAt: "asc" } },
      project: { include: { builder: true } },
    },
  });

  if (!job || job.homeownerId !== user.id) {
    notFound();
  }

  const totalEscrow = job.milestones.reduce((sum, m) => sum + m.amount, 0);

  return (
    <div>
      <h1 className="text-3xl font-semibold">{job.title}</h1>
      <p className="mt-2 text-stone-600">
        {job.postcode}
        {job.propertyType ? ` · ${job.propertyType}` : ""} · {job.status}
      </p>

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Quotes</p>
          <p className="text-2xl font-semibold">{job.quotes.length}</p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Milestones paid</p>
          <p className="text-2xl font-semibold">
            {job.milestones.filter((m) => m.status === "PAID").length} / {job.milestones.length}
          </p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Planned escrow (milestones)</p>
          <p className="text-2xl font-semibold">£{totalEscrow.toLocaleString()}</p>
        </article>
      </section>

      {job.project ? (
        <p className="mt-4 text-sm text-stone-700">
          <strong>Assigned builder:</strong> {job.project.builder.fullName || job.project.builder.email} · project {job.project.status}
        </p>
      ) : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Quotes</h2>
          <div className="mt-3 space-y-3">
            {job.quotes.length === 0 ? <p className="text-sm text-stone-600">No quotes yet.</p> : null}
            {job.quotes.map((quote) => (
              <div key={quote.id} className="rounded-lg border border-stone-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{quote.builder.fullName || quote.builder.email}</p>
                  <span className="text-xs uppercase text-stone-500">{quote.status}</span>
                </div>
                {quote.builder.builderProfile?.verified ? (
                  <p className="text-xs text-emerald-700">Verified builder</p>
                ) : null}
                <p className="text-sm text-stone-600">
                  £{quote.amount.toLocaleString()} · {quote.daysToComplete} days
                </p>
                <p className="mt-1 text-sm text-stone-800">{quote.introMessage}</p>
                {quote.status === "PENDING" && !job.project ? (
                  <form action={acceptQuote} className="mt-2">
                    <input type="hidden" name="quoteId" value={quote.id} />
                    <button type="submit" className="rounded-lg bg-stone-900 px-3 py-2 text-sm text-white">
                      Accept quote
                    </button>
                  </form>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Milestones</h2>
          <div className="mt-3 space-y-2">
            {job.milestones.length === 0 ? <p className="text-sm text-stone-600">No milestones yet.</p> : null}
            {job.milestones.map((m) => (
              <div key={m.id} className="rounded-lg border border-stone-200 p-3 text-sm">
                {m.title} · £{m.amount.toLocaleString()} · {m.status}
                {m.payment ? <span className="ml-2 text-xs text-stone-500">payment: {m.payment.status}</span> : null}
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

      <section className="mt-8 rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        <p className="text-sm text-stone-600">MVP: job-scoped thread (real-time chat in phase 2).</p>
        <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-lg bg-stone-50 p-3">
          {job.messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className="font-medium">{msg.sender.fullName || msg.sender.email}</span>
              <span className="text-stone-500"> · {new Date(msg.createdAt).toLocaleString()}</span>
              <p className="text-stone-800">{msg.body}</p>
            </div>
          ))}
          {job.messages.length === 0 ? <p className="text-sm text-stone-600">No messages yet.</p> : null}
        </div>
        <form action={sendJobMessage} className="mt-3 flex flex-col gap-2">
          <input type="hidden" name="jobId" value={job.id} />
          <textarea name="body" required rows={3} className="rounded-lg border border-stone-300 px-3 py-2 text-sm" placeholder="Write a message…" />
          <button type="submit" className="w-fit rounded-lg bg-stone-900 px-3 py-2 text-sm text-white">
            Send
          </button>
        </form>
      </section>

      <form action={markJobDisputed} className="mt-6">
        <input type="hidden" name="jobId" value={job.id} />
        <button type="submit" className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50">
          Escalate dispute for admin review
        </button>
      </form>
    </div>
  );
}
