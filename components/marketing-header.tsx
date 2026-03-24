import Link from "next/link";
import { LogoWordmark } from "@/components/logo-wordmark";
import { HeaderAuthControls } from "@/components/auth-header-buttons";
import { MobileNav, type MobileNavLink } from "@/components/mobile-nav";

const links: MobileNavLink[] = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-homeowners", label: "For homeowners" },
  { href: "/for-builders", label: "For builders" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const mobileLinks: MobileNavLink[] = [
  ...links,
  { href: "/sign-in", label: "Log in" },
  { href: "/sign-up", label: "Get started" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/90 bg-[#faf9f7]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#faf9f7]/80">
      <div className="container-app flex items-center justify-between gap-3 py-3 sm:py-4">
        <Link
          href="/"
          className="min-h-11 shrink-0 touch-manipulation font-serif text-lg font-semibold tracking-tight text-stone-900 sm:text-xl"
        >
          <LogoWordmark />
        </Link>

        <nav className="hidden flex-wrap items-center justify-center gap-5 text-sm text-stone-600 md:flex lg:gap-6" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="touch-manipulation transition-colors hover:text-stone-900">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-20 flex min-w-0 shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
          <HeaderAuthControls variant="marketing" />
          <MobileNav links={mobileLinks} />
        </div>
      </div>
    </header>
  );
}
