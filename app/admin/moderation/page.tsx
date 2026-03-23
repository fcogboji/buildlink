import { redirect } from "next/navigation";
import { hideReview, resolveDispute, suspendUser, verifyBuilder } from "@/app/actions";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/user-sync";

export default async function AdminModerationQueuePage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const [disputedJobs, unverifiedBuilders, reviewsToModerate, auditLogs] = await Promise.all([
    prisma.job.findMany({
      where: { status: "DISPUTED" },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.builderProfile.findMany({
      where: { verified: false },
      include: { user: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.review.findMany({
      where: { hidden: false },
      include: { author: true, target: true, job: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.adminAuditLog.findMany({
      include: { admin: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  return (
    <div>
      <SiteHeader />
      <main className="container-app space-y-8 py-6 sm:py-8 pb-safe">
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold">Moderation queue</h1>
              <p className="mt-2 text-stone-600">
                Prioritized moderation tasks and immutable audit trail for admin actions.
              </p>
            </div>
            <a href="/admin/moderation/export" className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
              Export audit CSV
            </a>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-stone-200 bg-white p-4">
              <p className="text-sm text-stone-500">Disputes</p>
              <p className="text-2xl font-semibold">{disputedJobs.length}</p>
            </article>
            <article className="rounded-xl border border-stone-200 bg-white p-4">
              <p className="text-sm text-stone-500">Unverified builders</p>
              <p className="text-2xl font-semibold">{unverifiedBuilders.length}</p>
            </article>
            <article className="rounded-xl border border-stone-200 bg-white p-4">
              <p className="text-sm text-stone-500">Pending reviews</p>
              <p className="text-2xl font-semibold">{reviewsToModerate.length}</p>
            </article>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-stone-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Disputes</h2>
            <div className="mt-3 space-y-3">
              {disputedJobs.map((job) => (
                <div key={job.id} className="rounded-lg border border-stone-200 p-3">
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-stone-600">{job.postcode}</p>
                  <form action={resolveDispute} className="mt-2">
                    <input type="hidden" name="jobId" value={job.id} />
                    <input type="hidden" name="reasonCode" value="evidence_reviewed" />
                    <button type="submit" className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs text-white">
                      Resolve dispute
                    </button>
                  </form>
                </div>
              ))}
              {disputedJobs.length === 0 ? <p className="text-sm text-stone-600">No active disputes.</p> : null}
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Builder verification</h2>
            <div className="mt-3 space-y-3">
              {unverifiedBuilders.map((profile) => (
                <div key={profile.id} className="rounded-lg border border-stone-200 p-3">
                  <p className="font-medium">{profile.companyName}</p>
                  <p className="text-sm text-stone-600">{profile.user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <form action={verifyBuilder}>
                      <input type="hidden" name="profileId" value={profile.id} />
                      <input type="hidden" name="reasonCode" value="verification_documents_ok" />
                      <button type="submit" className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs text-white">
                        Approve
                      </button>
                    </form>
                    <form action={suspendUser}>
                      <input type="hidden" name="userId" value={profile.user.id} />
                      <input type="hidden" name="suspend" value="1" />
                      <input type="hidden" name="reasonCode" value="verification_failed" />
                      <button type="submit" className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700">
                        Suspend
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              {unverifiedBuilders.length === 0 ? <p className="text-sm text-stone-600">No verification queue.</p> : null}
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Review moderation</h2>
            <div className="mt-3 space-y-3">
              {reviewsToModerate.map((review) => (
                <div key={review.id} className="rounded-lg border border-stone-200 p-3">
                  <p className="text-sm text-stone-500">
                    {review.author.email} → {review.target.email}
                  </p>
                  <p className="mt-1 text-sm">
                    {review.rating}★ {review.text}
                  </p>
                  <form action={hideReview} className="mt-2">
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input type="hidden" name="reasonCode" value="abusive_or_fake" />
                    <button type="submit" className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700">
                      Hide review
                    </button>
                  </form>
                </div>
              ))}
              {reviewsToModerate.length === 0 ? <p className="text-sm text-stone-600">No reviews in queue.</p> : null}
            </div>
          </article>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Recent moderation audit log</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-stone-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
                <tr>
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Admin</th>
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Target</th>
                  <th className="px-3 py-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-stone-100">
                    <td className="px-3 py-2 text-stone-600">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2">{log.admin.email}</td>
                    <td className="px-3 py-2">{log.action}</td>
                    <td className="px-3 py-2">
                      {log.targetType}:{log.targetId}
                    </td>
                    <td className="px-3 py-2 text-stone-600">{log.reasonCode || "—"}</td>
                  </tr>
                ))}
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-stone-500">
                      No moderation actions logged yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
