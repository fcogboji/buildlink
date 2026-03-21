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
