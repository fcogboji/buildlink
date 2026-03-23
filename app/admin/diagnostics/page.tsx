import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/user-sync";

function since(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000);
}

export default async function AdminDiagnosticsPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const [hits1hByAction, hits24hByAction, topScopeActionPairs] = await Promise.all([
    prisma.rateLimitHit.groupBy({
      by: ["action"],
      where: { createdAt: { gte: since(60) } },
      _count: { _all: true },
      orderBy: { _count: { action: "desc" } },
    }),
    prisma.rateLimitHit.groupBy({
      by: ["action"],
      where: { createdAt: { gte: since(24 * 60) } },
      _count: { _all: true },
      orderBy: { _count: { action: "desc" } },
    }),
    prisma.rateLimitHit.groupBy({
      by: ["scopeKey", "action"],
      where: { createdAt: { gte: since(60) } },
      _count: { _all: true },
      orderBy: { _count: { scopeKey: "desc" } },
      take: 25,
    }),
  ]);

  const actionTo1h = new Map(hits1hByAction.map((r) => [r.action, r._count._all]));
  const actionTo24h = new Map(hits24hByAction.map((r) => [r.action, r._count._all]));
  const actions = [...new Set([...actionTo1h.keys(), ...actionTo24h.keys()])].sort();
  const total1h = hits1hByAction.reduce((sum, r) => sum + r._count._all, 0);
  const total24h = hits24hByAction.reduce((sum, r) => sum + r._count._all, 0);

  return (
    <div>
      <SiteHeader />
      <main className="container-app py-6 sm:py-8 pb-safe">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Operational diagnostics</h1>
            <p className="mt-2 text-stone-600">Rate-limit activity, hotspots, and request pressure.</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/admin/diagnostics/export" className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
              Export CSV
            </a>
            <Link href="/admin" className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
              Back to admin
            </Link>
          </div>
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm text-stone-500">Rate-limit hits (last 1h)</p>
            <p className="text-3xl font-semibold">{total1h.toLocaleString()}</p>
          </article>
          <article className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm text-stone-500">Rate-limit hits (last 24h)</p>
            <p className="text-3xl font-semibold">{total24h.toLocaleString()}</p>
          </article>
        </section>

        <section className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Hits by action</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stone-200 text-stone-600">
                <tr>
                  <th className="px-2 py-2">Action</th>
                  <th className="px-2 py-2">Last 1h</th>
                  <th className="px-2 py-2">Last 24h</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action) => (
                  <tr key={action} className="border-b border-stone-100">
                    <td className="px-2 py-2 font-medium">{action}</td>
                    <td className="px-2 py-2">{(actionTo1h.get(action) || 0).toLocaleString()}</td>
                    <td className="px-2 py-2">{(actionTo24h.get(action) || 0).toLocaleString()}</td>
                  </tr>
                ))}
                {actions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-2 py-4 text-stone-500">
                      No rate-limit activity yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Top scoped hitters (last 1h)</h2>
          <p className="mt-1 text-sm text-stone-600">Most frequently rate-limited scope/action pairs.</p>
          <ul className="mt-3 space-y-2">
            {topScopeActionPairs.map((row) => (
              <li key={`${row.scopeKey}:${row.action}`} className="rounded-lg border border-stone-200 p-3 text-sm">
                <span className="font-medium">{row.scopeKey}</span>
                <span className="text-stone-500"> · {row.action}</span>
                <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
                  {row._count._all} hits
                </span>
              </li>
            ))}
            {topScopeActionPairs.length === 0 ? (
              <li className="text-sm text-stone-500">No scope hotspots in the last hour.</li>
            ) : null}
          </ul>
        </section>
      </main>
    </div>
  );
}
