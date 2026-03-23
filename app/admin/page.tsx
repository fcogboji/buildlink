import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ensureUser } from "@/lib/user-sync";

export default async function AdminPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div>
      <SiteHeader />
      <main className="container-app py-6 sm:py-8 pb-safe">
        <h1 className="text-3xl font-semibold">Admin control center</h1>
        <p className="mt-2 text-stone-600">Moderate trust, monitor marketplace quality, and resolve disputes quickly.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/moderation" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Moderation queue & audit logs
          </Link>
          <Link href="/admin/users" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Users — verify & suspend
          </Link>
          <Link href="/admin/jobs" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Jobs — quality & flags
          </Link>
          <Link href="/admin/reviews" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Review moderation
          </Link>
          <Link href="/admin/payments" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Payments & refunds
          </Link>
          <Link href="/admin/disputes" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Disputes
          </Link>
          <Link href="/admin/analytics" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Analytics
          </Link>
          <Link href="/admin/diagnostics" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Diagnostics — rate limits
          </Link>
        </div>
      </main>
    </div>
  );
}
