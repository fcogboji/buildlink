import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return children;
}
