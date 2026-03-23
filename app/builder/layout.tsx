import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isBuilderSubscriptionActive } from "@/lib/billing";
import { ensureUser } from "@/lib/user-sync";

export const dynamic = "force-dynamic";

export default async function BuilderLayout({ children }: { children: ReactNode }) {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "BUILDER" && user.role !== "ADMIN") {
    redirect("/dashboard/homeowner");
  }
  if (user.role === "BUILDER" && !isBuilderSubscriptionActive(user.stripeSubscriptionStatus)) {
    redirect(`/pricing?upgrade=builder&status=${user.stripeSubscriptionStatus.toLowerCase()}`);
  }

  return children;
}
