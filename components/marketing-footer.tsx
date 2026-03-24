import Link from "next/link";
import { LogoWordmark } from "@/components/logo-wordmark";

export function MarketingFooter() {
  return (
    <footer className="border-t border-stone-700/80 bg-stone-950 py-12 text-stone-400 pb-safe">
      <div className="container-app flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-xl text-stone-100">
            <LogoWordmark />
          </p>
          <p className="mt-2 max-w-sm text-sm text-stone-400">UK trusted workflows for homeowners and builders.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <Link href="/privacy" className="transition-colors hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-white">
            Terms
          </Link>
          <Link href="/contact" className="transition-colors hover:text-white">
            Contact
          </Link>
        </div>
      </div>
      <p className="container-app mt-8 border-t border-stone-800 pt-5 text-xs text-stone-500">
        © {new Date().getFullYear()}{" "}
        <LogoWordmark />
        . All rights reserved.
      </p>
    </footer>
  );
}
