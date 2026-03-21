import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SiteHeader } from "@/components/site-header";
import { ensureUser } from "@/lib/user-sync";

const nav = [
  { href: "/dashboard/homeowner", label: "Overview" },
  { href: "/dashboard/homeowner/jobs", label: "Jobs" },
  { href: "/dashboard/homeowner/messages", label: "Messages" },
  { href: "/dashboard/homeowner/payments", label: "Payments" },
  { href: "/dashboard/homeowner/profile", label: "Profile" },
];

export default async function HomeownerDashboardLayout({ children }: { children: ReactNode }) {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "HOMEOWNER" && user.role !== "ADMIN") {
    redirect("/dashboard/builder");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <SiteHeader />
      <div className="container-app flex min-w-0 flex-col gap-6 py-6 pb-safe lg:flex-row lg:gap-10 lg:py-8">
        <DashboardSidebar title="Homeowner" items={nav} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
