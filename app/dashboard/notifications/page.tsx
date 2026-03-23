import Link from "next/link";
import { redirect } from "next/navigation";
import { markAllNotificationsRead, markNotificationRead } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/user-sync";

export default async function NotificationsPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-stone-900">Notifications</h1>
          <p className="mt-2 text-stone-600">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 ? (
          <form action={markAllNotificationsRead}>
            <button type="submit" className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-800">
              Mark all as read
            </button>
          </form>
        ) : null}
      </div>

      <section className="mt-6 space-y-3">
        {notifications.map((n) => (
          <article
            key={n.id}
            className={`rounded-xl border p-4 ${n.readAt ? "border-stone-200 bg-white" : "border-amber-200 bg-amber-50/60"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-stone-900">{n.title}</p>
                <p className="mt-1 text-sm text-stone-700">{n.body}</p>
                <p className="mt-2 text-xs text-stone-500">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.readAt ? (
                <form action={markNotificationRead}>
                  <input type="hidden" name="notificationId" value={n.id} />
                  <button type="submit" className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs text-stone-700">
                    Mark read
                  </button>
                </form>
              ) : null}
            </div>
            {n.jobId ? (
              <div className="mt-3">
                <Link
                  href={user.role === "HOMEOWNER" ? `/dashboard/homeowner/jobs/${n.jobId}` : `/dashboard/builder/jobs/${n.jobId}`}
                  className="text-sm font-medium text-amber-800 hover:underline"
                >
                  Open related job
                </Link>
              </div>
            ) : null}
          </article>
        ))}
        {notifications.length === 0 ? (
          <article className="rounded-xl border border-stone-200 bg-white p-4 text-stone-600">No notifications yet.</article>
        ) : null}
      </section>
    </div>
  );
}
