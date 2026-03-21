import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { hideReview } from "@/app/actions";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function AdminReviewsPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, target: true, job: true },
    take: 100,
  });

  return (
    <div>
      <SiteHeader />
      <main className="container-app py-6 sm:py-8 pb-safe">
        <h1 className="text-3xl font-semibold">Review moderation</h1>
        <p className="mt-2 text-stone-600">Hide fake or abusive reviews. Tie reviews to completed jobs in production.</p>
        <ul className="mt-6 space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className={`rounded-xl border border-stone-200 bg-white p-4 ${r.hidden ? "opacity-60" : ""}`}>
              <p className="text-sm text-stone-500">
                {r.author.email} → {r.target.email}
                {r.job ? ` · job: ${r.job.title}` : ""}
              </p>
              <p className="mt-1 font-medium">
                {r.rating}★ {r.verified ? "· verified" : ""} {r.hidden ? "· hidden" : ""}
              </p>
              <p className="mt-1 text-stone-800">{r.text}</p>
              {!r.hidden ? (
                <form action={hideReview} className="mt-2">
                  <input type="hidden" name="reviewId" value={r.id} />
                  <button type="submit" className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-800">
                    Hide review
                  </button>
                </form>
              ) : null}
            </li>
          ))}
          {reviews.length === 0 ? <li className="text-stone-600">No reviews yet.</li> : null}
        </ul>
      </main>
    </div>
  );
}
