"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const authRedirect = {
  forceRedirectUrl: "/dashboard",
  fallbackRedirectUrl: "/onboarding",
} as const;

export type MobileNavLink = { href: string; label: string };

type MobileNavProps = {
  links: MobileNavLink[];
  className?: string;
  /** Screen-reader label for the menu button */
  menuLabel?: string;
};

export function MobileNav({ links, className = "", menuLabel = "Open menu" }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  const resolvedLinks = useMemo(() => {
    if (!isLoaded || !isSignedIn) return links;
    return links.filter((l) => l.href !== "/sign-in" && l.href !== "/sign-up");
  }, [links, isLoaded, isSignedIn]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className={`md:hidden ${className}`}>
      <button
        type="button"
        className="touch-manipulation inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-stone-300/90 bg-white/90 text-stone-900 shadow-sm transition hover:bg-white active:bg-stone-100"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : menuLabel}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-black/50 touch-manipulation"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav-panel"
            className="fixed inset-x-0 top-0 z-[70] max-h-[90dvh] overflow-y-auto rounded-b-2xl border-b border-stone-200 bg-[#faf9f7] px-4 pb-safe shadow-2xl"
            role="dialog"
            aria-modal="true"
            style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
          >
            <div className="flex items-center justify-between border-b border-stone-200 py-3">
              <span className="font-serif text-lg font-semibold text-stone-900">Menu</span>
              <button
                type="button"
                className="touch-manipulation rounded-lg px-4 py-2 text-sm font-medium text-stone-600 active:bg-stone-200"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <nav className="flex flex-col gap-1 py-4" aria-label="Mobile">
              {resolvedLinks.map((l) => {
                const rowClass =
                  "touch-manipulation w-full rounded-xl px-3 py-3.5 text-left text-base text-stone-800 active:bg-stone-200/80";
                if (l.href === "/sign-in") {
                  return (
                    <SignInButton key={l.href} mode="redirect" {...authRedirect}>
                      <button type="button" className={rowClass} onClick={() => setOpen(false)}>
                        {l.label}
                      </button>
                    </SignInButton>
                  );
                }
                if (l.href === "/sign-up") {
                  return (
                    <SignUpButton key={l.href} mode="redirect" {...authRedirect}>
                      <button type="button" className={rowClass} onClick={() => setOpen(false)}>
                        {l.label}
                      </button>
                    </SignUpButton>
                  );
                }
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={rowClass}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      ) : null}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}
