import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function BuilderLayout({ children }: { children: ReactNode }) {
  return children;
}
