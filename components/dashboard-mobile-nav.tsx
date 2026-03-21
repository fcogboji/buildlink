"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type DashboardNavItem = { href: string; label: string };

type Props = {
  title: string;
  items: DashboardNavItem[];
};

function navItemActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(`${href}/`);
}

export function DashboardMobileNav({ title, items }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label={title} className="lg:hidden">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">{title}</p>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
        {items.map((item) => {
          const active = navItemActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`touch-manipulation shrink-0 snap-start rounded-full border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "border-amber-700 bg-amber-50 text-amber-950"
                  : "border-stone-200 bg-white text-stone-800 active:bg-stone-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
