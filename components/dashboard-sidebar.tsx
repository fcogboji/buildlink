import Link from "next/link";
import { DashboardMobileNav } from "@/components/dashboard-mobile-nav";
import type { DashboardNavItem } from "@/components/dashboard-mobile-nav";

export type NavItem = DashboardNavItem;

type DashboardSidebarProps = {
  title: string;
  items: NavItem[];
};

export function DashboardSidebar({ title, items }: DashboardSidebarProps) {
  return (
    <>
      <DashboardMobileNav title={title} items={items} />
      <aside className="hidden w-52 shrink-0 lg:block xl:w-56" aria-label={title}>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{title}</p>
        <nav className="mt-3 flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
