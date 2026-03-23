import Link from "next/link";
import { HeaderAuthControls } from "@/components/auth-header-buttons";
import { MobileNav, type MobileNavLink } from "@/components/mobile-nav";

const nav: MobileNavLink[] = [
  { href: "/dashboard", label: "Hub" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/homeowner", label: "Homeowner" },
  { href: "/dashboard/builder", label: "Builder" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/admin", label: "Admin" },
  { href: "/pricing", label: "Pricing" },
];

const mobileNav: MobileNavLink[] = [
  ...nav,
  { href: "/sign-in", label: "Log in" },
  { href: "/sign-up", label: "Sign up" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/90 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container-app flex items-center justify-between gap-3 py-3 sm:py-4">
        <Link href="/" className="min-h-11 shrink-0 touch-manipulation text-lg font-semibold sm:text-xl">
          Build<span className="text-amber-700">Link</span>
        </Link>

        <nav className="hidden flex-wrap items-center justify-center gap-4 text-sm text-stone-600 lg:flex" aria-label="App">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="touch-manipulation transition-colors hover:text-stone-900">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-20 flex shrink-0 flex-wrap items-center justify-end gap-2">
          <HeaderAuthControls variant="site" />
          <MobileNav links={mobileNav} />
        </div>
      </div>
    </header>
  );
}
