import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-900 py-10 text-stone-400 pb-safe">
      <div className="container-app flex flex-col gap-6 md:flex-row md:justify-between">
        <div>
          <p className="font-serif text-lg text-stone-100">
            Build<span className="text-amber-500">Link</span>
          </p>
          <p className="mt-2 max-w-sm text-sm">UK trusted workflows for homeowners and builders.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
        </div>
      </div>
      <p className="container-app mt-8 text-xs text-stone-500">© {new Date().getFullYear()} BuildLink. All rights reserved.</p>
    </footer>
  );
}
