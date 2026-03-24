"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const redirect = {
  forceRedirectUrl: "/dashboard",
  fallbackRedirectUrl: "/onboarding",
} as const;

type PairVariant = "marketing" | "landing";

const pairStyles: Record<PairVariant, { login: string; signup: string; loginLabel: string; signupLabel: string }> = {
  marketing: {
    login:
      "inline-flex min-h-11 min-w-0 touch-manipulation items-center justify-center rounded-xl border border-stone-300/90 bg-white/90 px-3 text-xs font-medium text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-white sm:px-4 sm:text-sm",
    signup:
      "inline-flex min-h-11 min-w-0 touch-manipulation items-center justify-center rounded-xl bg-stone-900 px-3 text-xs font-medium text-white shadow-sm transition hover:bg-black sm:px-4 sm:text-sm",
    loginLabel: "Log in",
    signupLabel: "Get started",
  },
  landing: {
    login:
      "inline-flex min-h-11 min-w-0 touch-manipulation items-center justify-center rounded-lg border border-white/35 bg-white/5 px-3 text-xs font-medium text-white shadow-sm transition hover:border-white/50 hover:bg-white/10 sm:px-4 sm:text-sm",
    signup:
      "inline-flex min-h-11 min-w-0 touch-manipulation items-center justify-center rounded-lg bg-[#22c55e] px-3 text-xs font-semibold text-white shadow-md shadow-emerald-900/20 transition hover:bg-[#16a34a] sm:px-4 sm:text-sm",
    loginLabel: "Login",
    signupLabel: "Get Started",
  },
};

/** Clerk-driven redirects — avoids Next Link + Clerk edge cases on mobile. */
export function AuthHeaderButtonPair({ variant }: { variant: PairVariant }) {
  const s = pairStyles[variant];
  return (
    <>
      <SignInButton mode="redirect" {...redirect}>
        <button type="button" className={s.login}>
          {s.loginLabel}
        </button>
      </SignInButton>
      <SignUpButton mode="redirect" {...redirect}>
        <button type="button" className={s.signup}>
          {s.signupLabel}
        </button>
      </SignUpButton>
    </>
  );
}

export function AuthHeaderLoginOnly() {
  return (
    <SignInButton mode="redirect" {...redirect}>
      <button
        type="button"
        className="inline-flex min-h-11 touch-manipulation items-center rounded-xl border border-stone-300/90 bg-white/90 px-3 text-xs font-medium text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-white sm:px-4 sm:text-sm"
      >
        Login
      </button>
    </SignInButton>
  );
}

export type HeaderAuthVariant = "marketing" | "landing" | "site";

/**
 * Log in / Get started only when signed out. When signed in, show account menu
 * (so “Login” doesn’t appear on the dashboard while you’re already logged in).
 */
export function HeaderAuthControls({ variant }: { variant: HeaderAuthVariant }) {
  return (
    <div className="flex min-h-11 items-center gap-2">
      <Show when="signed-out">
        {variant === "site" ? (
          <AuthHeaderLoginOnly />
        ) : (
          <AuthHeaderButtonPair variant={variant === "landing" ? "landing" : "marketing"} />
        )}
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-9 w-9",
              userButtonPopoverCard: "rounded-xl",
            },
          }}
        />
      </Show>
    </div>
  );
}
