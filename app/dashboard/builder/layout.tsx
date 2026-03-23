import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SiteHeader } from "@/components/site-header";
import { isBuilderSubscriptionActive } from "@/lib/billing";
import { ensureUser } from "@/lib/user-sync";

const nav = [
  { href: "/dashboard/builder", label: "Overview" },
  { href: "/dashboard/builder/jobs/feed", label: "Job feed" },
  { href: "/dashboard/builder/quotes", label: "Quotes" },
  { href: "/dashboard/builder/projects", label: "Projects" },
  { href: "/dashboard/builder/messages", label: "Messages" },
  { href: "/dashboard/builder/earnings", label: "Earnings" },
  { href: "/dashboard/builder/profile", label: "Profile" },
];

export default async function BuilderDashboardLayout({ children }: { children: ReactNode }) {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "BUILDER" && user.role !== "ADMIN") {
    redirect("/dashboard/homeowner");
  }
  if (user.role === "BUILDER" && !isBuilderSubscriptionActive(user.stripeSubscriptionStatus)) {
    redirect(`/pricing?upgrade=builder&status=${user.stripeSubscriptionStatus.toLowerCase()}`);
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <SiteHeader />
      <div className="container-app flex min-w-0 flex-col gap-6 py-6 pb-safe lg:flex-row lg:gap-10 lg:py-8">
        <DashboardSidebar title="Builder" items={nav} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
