import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { DashboardCard } from "@/components/dashboard-card";
import { SiteHeader } from "@/components/site-header";
import { updateMyRole } from "@/app/actions";
import { ensureUser } from "@/lib/user-sync";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await ensureUser();

  return (
    <div>
      <SiteHeader />
      <main className="container-app space-y-8 py-6 sm:py-8 pb-safe">
        <section>
          <h1 className="text-3xl font-semibold">Welcome to BuildLink</h1>
          <p className="mt-2 text-stone-600">
            Your role: <span className="font-medium">{user?.role ?? "HOMEOWNER"}</span>
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <DashboardCard title="Average quote response time" value="12h" hint="Faster than traditional marketplaces." />
          <DashboardCard title="Milestone payment protection" value="100%" hint="Escrow-first workflow is enabled." />
          <DashboardCard title="High-value focus jobs" value="£10k+" hint="Optimized for stronger conversion and margins." />
        </section>

        <section className="max-w-sm rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Switch workspace role</h2>
          <p className="mt-1 text-sm text-stone-600">Useful for testing homeowner, builder, and admin flows.</p>
          <form action={updateMyRole} className="mt-3 flex items-center gap-2">
            <select name="role" defaultValue={user?.role ?? "HOMEOWNER"} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
              <option value="HOMEOWNER">HOMEOWNER</option>
              <option value="BUILDER">BUILDER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button className="rounded-lg bg-stone-900 px-3 py-2 text-sm text-white" type="submit">
              Save
            </button>
          </form>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <Link href="/dashboard/homeowner" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Homeowner workspace: post jobs, compare quotes, track milestones.
          </Link>
          <Link href="/dashboard/builder" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Builder workspace: job feed, quotes, projects, earnings.
          </Link>
          <Link href="/admin" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Admin center: verification, disputes, trust moderation.
          </Link>
          <Link href="/pricing" className="rounded-xl border border-stone-200 bg-white p-4 hover:bg-stone-50">
            Pricing: Stripe-powered builder plans.
          </Link>
        </section>
      </main>
    </div>
  );
}
