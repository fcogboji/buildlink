import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { suspendUser, verifyBuilder } from "@/app/actions";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { builderProfile: true },
    take: 100,
  });

  return (
    <div>
      <SiteHeader />
      <main className="container-app py-6 sm:py-8 pb-safe">
        <h1 className="text-3xl font-semibold">User management</h1>
        <p className="mt-2 text-stone-600">View accounts, suspend access, and verify builders.</p>

        <section className="mt-8 space-y-3">
          {users.map((u) => (
            <article key={u.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{u.fullName || u.email}</p>
                  <p className="text-sm text-stone-600">
                    {u.email} · {u.role} {u.suspended ? "· suspended" : ""}
                  </p>
                </div>
                <form action={suspendUser} className="flex items-center gap-2">
                  <input type="hidden" name="userId" value={u.id} />
                  <input type="hidden" name="suspend" value={u.suspended ? "0" : "1"} />
                  <button type="submit" className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
                    {u.suspended ? "Unsuspend" : "Suspend"}
                  </button>
                </form>
              </div>
              {u.builderProfile && !u.builderProfile.verified ? (
                <form action={verifyBuilder} className="mt-3">
                  <input type="hidden" name="profileId" value={u.builderProfile.id} />
                  <button type="submit" className="rounded-lg bg-stone-900 px-3 py-2 text-sm text-white">
                    Approve builder verification
                  </button>
                </form>
              ) : null}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
