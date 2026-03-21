"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeaderAuthControls } from "@/components/auth-header-buttons";
import { MobileNav, type MobileNavLink } from "@/components/mobile-nav";

const features = [
  { icon: "✦", title: "Verified Builders", desc: "Identity checks, verified invoices, and moderated reviews." },
  { icon: "⟡", title: "Smart Matching", desc: "Better-fit leads using scope, budget, timeline, and location." },
  { icon: "⬡", title: "Escrow Milestones", desc: "Funds are released per approved milestone to reduce payment risk." },
  { icon: "◈", title: "Project Workflow", desc: "Quotes, milestones, files, and chat in one timeline." },
  { icon: "◎", title: "No Junk Leads", desc: "Builders only pay for value, not random lead gambling." },
  { icon: "⊕", title: "Dispute Support", desc: "Structured issue handling with evidence and admin mediation." },
];

const faqs = [
  { q: "How is BuildLink different from directories?", a: "We focus on match quality and delivery workflow, not just listing profiles." },
  { q: "How are builders verified?", a: "Identity, company checks, work history evidence, and customer proof are reviewed before trust badges." },
  { q: "How do payments stay safe?", a: "Escrow-style milestones keep both homeowner and builder protected throughout a project." },
];

const mobileMenuLinks: MobileNavLink[] = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-homeowners", label: "For homeowners" },
  { href: "/for-builders", label: "For builders" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/sign-in", label: "Log in" },
  { href: "/sign-up", label: "Get started" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#faf9f7] font-sans text-[#1c1a18]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <header
        className={`sticky top-0 z-30 border-b border-[#ece7e1] bg-[#faf9f7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#faf9f7]/90 ${scrolled ? "shadow-sm" : ""}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="container-app flex flex-wrap items-center justify-between gap-3 py-3 sm:py-4">
          <Link
            href="/"
            className="min-h-11 shrink-0 touch-manipulation font-['Playfair_Display',serif] text-xl font-semibold sm:text-2xl"
          >
            Build<span className="text-[#b45309]">Link</span>
          </Link>

          <nav className="hidden flex-wrap items-center gap-4 text-sm text-[#6b6560] md:flex md:gap-5" aria-label="Marketing">
            <Link href="/how-it-works" className="touch-manipulation hover:text-[#1c1a18]">
              How it works
            </Link>
            <Link href="/for-homeowners" className="touch-manipulation hover:text-[#1c1a18]">
              Homeowners
            </Link>
            <Link href="/for-builders" className="touch-manipulation hover:text-[#1c1a18]">
              Builders
            </Link>
            <Link href="/pricing" className="touch-manipulation hover:text-[#1c1a18]">
              Pricing
            </Link>
          </nav>

          <div className="relative z-20 flex min-w-0 shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
            <HeaderAuthControls variant="landing" />
            <MobileNav links={mobileMenuLinks} />
          </div>
        </div>
      </header>

      <section className="container-app grid grid-cols-1 gap-8 py-10 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:gap-10 lg:py-20">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#b45309] sm:mb-3">UK trusted builder workflow</p>
          <h1 className="font-['Playfair_Display',serif] text-[clamp(2rem,8vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-[#1c1a18]">
            Find the right builder and finish projects without chaos
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#6b6560] sm:text-lg">
            BuildLink is designed to beat saturated directories by fixing trust, match quality, and payment risk. Homeowners get confidence.
            Builders get qualified work.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link
              href="/onboarding/homeowner"
              className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-xl bg-[#1c1a18] px-5 text-center text-sm font-medium text-[#faf9f7] sm:min-h-11"
            >
              Post a Job
            </Link>
            <Link
              href="/onboarding/builder"
              className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-xl border border-[#d4cdc4] px-5 text-center text-sm font-medium text-[#1c1a18] sm:min-h-11"
            >
              Join as Builder
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-xl border border-[#d4cdc4] px-5 text-center text-sm font-medium text-[#1c1a18] sm:min-h-11"
            >
              Pricing
            </Link>
          </div>
        </div>
        <div className="min-w-0 rounded-2xl bg-[#1c1a18] p-5 text-white sm:p-6 lg:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-[#d1a57e]">Differentiation strategy</p>
          <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-[#e9ddd1] sm:text-[15px]">
            <li>Trust proof via invoice-backed history and moderated reviews.</li>
            <li>Matching engine prioritizes fit, not lead volume.</li>
            <li>End-to-end project flow after hire, not directory drop-off.</li>
            <li>Escrow milestones to reduce non-payment and dispute friction.</li>
          </ul>
        </div>
      </section>

      <section className="container-app py-10 sm:py-14 lg:py-16">
        <h2 className="font-['Playfair_Display',serif] text-2xl font-bold tracking-tight text-[#1c1a18] sm:text-3xl lg:text-[34px]">
          Why users switch to BuildLink
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-[18px] border border-[#e8e4df] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-2 text-2xl text-[#b45309]">{f.icon}</div>
              <h3 className="font-['Playfair_Display',serif] text-lg font-semibold text-[#1c1a18]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6b6560] sm:text-[15px]">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-app py-10 sm:py-14 lg:py-16">
        <h2 className="font-['Playfair_Display',serif] text-2xl font-bold tracking-tight text-[#1c1a18] sm:text-3xl lg:text-[34px]">
          FAQ
        </h2>
        <div className="mt-6 space-y-2 sm:mt-8">
          {faqs.map((item, index) => (
            <div key={item.q} className="overflow-hidden rounded-[14px] border border-[#e8e4df] bg-white">
              <button
                type="button"
                className="flex min-h-14 w-full touch-manipulation items-center justify-between gap-4 px-4 py-4 text-left text-sm font-medium text-[#1c1a18] sm:px-5 sm:text-base"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                aria-expanded={openFaq === index}
              >
                <span className="pr-2">{item.q}</span>
                <span className="shrink-0 text-[#b45309]" aria-hidden>
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>
              {openFaq === index ? (
                <p className="border-t border-[#e8e4df] px-4 py-4 text-sm leading-relaxed text-[#6b6560] sm:px-5 sm:text-[15px]">{item.a}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#1c1a18] py-10 pb-safe text-center text-[#ded6ce]">
        <div className="container-app flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
          <Link href="/about" className="touch-manipulation min-h-11 inline-flex items-center text-[#ded6ce]">
            About
          </Link>
          <Link href="/contact" className="touch-manipulation min-h-11 inline-flex items-center text-[#ded6ce]">
            Contact
          </Link>
          <Link href="/privacy" className="touch-manipulation min-h-11 inline-flex items-center text-[#ded6ce]">
            Privacy
          </Link>
          <Link href="/terms" className="touch-manipulation min-h-11 inline-flex items-center text-[#ded6ce]">
            Terms
          </Link>
        </div>
        <p className="container-app mt-6 text-xs leading-relaxed text-[#a8a29e] sm:text-sm">
          © 2026 BuildLink. Acquisition · marketplace · projects · payments & trust.
        </p>
      </footer>
    </div>
  );
}
