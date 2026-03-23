import { updateEmailNotificationPreference } from "@/app/actions";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function BuilderProfilePage() {
  const user = await ensureUser();
  if (!user) return null;

  const profile = await prisma.builderProfile.findUnique({ where: { userId: user.id } });
  const reviews = await prisma.review.findMany({
    where: { targetId: user.id, hidden: false },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Profile</h1>
      <p className="mt-2 text-stone-600">Portfolio, service areas, and reputation.</p>

      {profile ? (
        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 text-sm">
          <p>
            <strong>{profile.companyName}</strong> {profile.verified ? "· verified" : ""}
          </p>
          <p className="mt-2 text-stone-700">Trades: {profile.trades.join(", ") || "—"}</p>
          <p className="text-stone-700">Areas: {profile.serviceAreas.join(", ") || "—"}</p>
          <p className="mt-2 text-stone-600">{profile.bio || "No bio yet."}</p>
          <p className="mt-2 text-xs text-stone-500">Rating (computed): {profile.rating.toFixed(1)}</p>
        </section>
      ) : (
        <p className="mt-6 text-stone-600">Complete builder onboarding to create your profile.</p>
      )}

      <section className="mt-8">
        <section className="mt-5 max-w-lg rounded-2xl border border-stone-200 bg-white p-5 text-sm">
          <p className="font-medium text-stone-900">Email notifications</p>
          <p className="mt-1 text-stone-600">Receive event emails for quotes, messages, and milestones.</p>
          <form action={updateEmailNotificationPreference} className="mt-3 flex items-center gap-3">
            <input type="hidden" name="emailNotificationsEnabled" value="0" />
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="emailNotificationsEnabled"
                value="1"
                defaultChecked={dbUser?.emailNotificationsEnabled ?? true}
                className="h-4 w-4 rounded border-stone-300"
              />
              <span>Enable email notifications</span>
            </label>
            <button type="submit" className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-800">
              Save
            </button>
          </form>
        </section>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Recent reviews</h2>
        <ul className="mt-3 space-y-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-lg border border-stone-200 bg-white p-3 text-sm">
              {r.rating}★ — {r.text}
            </li>
          ))}
          {reviews.length === 0 ? <li className="text-stone-600">No public reviews yet.</li> : null}
        </ul>
      </section>
    </div>
  );
}
