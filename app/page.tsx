"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HeaderAuthControls } from "@/components/auth-header-buttons";
import { LogoWordmark } from "@/components/logo-wordmark";
import { MobileNav, type MobileNavLink } from "@/components/mobile-nav";

const features = [
  { icon: "01", title: "Verified Builders", desc: "Identity checks, verified invoices, and moderated reviews." },
  { icon: "02", title: "Smart Matching", desc: "Better-fit leads using scope, budget, timeline, and location." },
  { icon: "03", title: "Escrow Milestones", desc: "Funds are released per approved milestone to reduce payment risk." },
  { icon: "04", title: "Project Workflow", desc: "Quotes, milestones, files, and chat in one timeline." },
  { icon: "05", title: "No Junk Leads", desc: "Builders only pay for value, not random lead gambling." },
  { icon: "06", title: "Dispute Support", desc: "Structured issue handling with evidence and admin mediation." },
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

function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#22c55e]">{eyebrow}</p>
      ) : null}
      <div className="mb-3 h-1 w-14 rounded-full bg-[#22c55e]" aria-hidden />
      <h2 className="text-2xl font-bold tracking-tight text-[#002D62] sm:text-3xl lg:text-[2rem]">{title}</h2>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-white font-sans text-[#4a4a4a]">
      {/* Hero band: deep navy + white copy */}
      <div className="bg-gradient-to-b from-[#163357] via-[#12304d] to-[#0f2744] text-white">
        <header
          className={`sticky top-0 z-30 border-b border-white/10 transition-[background,box-shadow] ${
            scrolled ? "bg-[#0f2744]/95 shadow-lg shadow-black/20 backdrop-blur-md" : "bg-[#163357]/80 backdrop-blur-sm"
          }`}
        >
          <div className="container-app flex flex-wrap items-center justify-between gap-3 py-3 sm:py-4">
            <Link
              href="/"
              className="min-h-11 shrink-0 touch-manipulation text-lg font-bold tracking-tight text-white sm:text-xl"
            >
              <LogoWordmark />
            </Link>

            <nav className="hidden flex-wrap items-center gap-4 text-sm text-white/80 md:flex md:gap-5" aria-label="Marketing">
              <Link href="/how-it-works" className="touch-manipulation transition hover:text-white">
                How it works
              </Link>
              <Link href="/for-homeowners" className="touch-manipulation transition hover:text-white">
                Homeowners
              </Link>
              <Link href="/for-builders" className="touch-manipulation transition hover:text-white">
                Builders
              </Link>
              <Link href="/pricing" className="touch-manipulation transition hover:text-white">
                Pricing
              </Link>
            </nav>

            <div className="relative z-20 flex min-w-0 shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
              <HeaderAuthControls variant="landing" />
              <MobileNav links={mobileMenuLinks} variant="dark" />
            </div>
          </div>
        </header>

        <section className="container-app pb-14 pt-10 sm:pb-20 sm:pt-14 lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-12 lg:pb-24 lg:pt-10">
          <div className="min-w-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#86efac]/90">UK trusted builder workflow</p>
            <h1 className="text-[clamp(1.85rem,6vw,3.25rem)] font-bold leading-[1.12] tracking-tight text-white">
              The marketplace where homeowners and builders actually finish the job
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Less noise, clearer fit, safer payments. BuildLink brings trust, matching, and milestones into one calm workflow—so projects feel human again.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/onboarding/homeowner"
                className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-lg bg-[#22c55e] px-6 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-[#16a34a] sm:min-h-11"
              >
                Post a job
              </Link>
              <Link
                href="/onboarding/builder"
                className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-lg border border-white/35 bg-white/5 px-6 text-center text-sm font-medium text-white transition hover:border-white/50 hover:bg-white/10 sm:min-h-11"
              >
                Join as a builder
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-lg border border-transparent px-6 text-center text-sm font-medium text-white/90 underline-offset-4 hover:text-white hover:underline sm:min-h-11"
              >
                View pricing
              </Link>
            </div>
          </div>

          <div className="relative mt-10 min-w-0 lg:mt-0">
            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-[#22c55e]/25 blur-2xl lg:-right-10 lg:h-48 lg:w-48" aria-hidden />
            <div className="absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-[#1e3a5f]/80 blur-xl" aria-hidden />
            <div className="relative rounded-2xl border border-white/15 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#86efac]">Why people stay</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/90 sm:text-[15px]">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" aria-hidden />
                  <span>Proof-backed trust—not just star ratings on a profile.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" aria-hidden />
                  <span>Matching that respects scope, budget, and where you work.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" aria-hidden />
                  <span>Milestones and messages in one place—no endless email threads.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" aria-hidden />
                  <span>Support when something goes wrong, with a clear paper trail.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="border-t border-white/10 bg-[#0f2744]/80 py-8">
          <div className="container-app text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Trusted workflow</p>
            <p className="mt-2 text-sm text-white/85">Built for real projects across the UK—homeowners, trades, and teams who want clarity from quote to completion.</p>
            <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === 2 ? "bg-[#22c55e]" : "bg-white/25"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-[#e8eef4] bg-[#fafbfc]">
        <div className="container-app py-14 sm:py-16 lg:py-20">
          <SectionTitle eyebrow="Real people, real projects" title="Built for trades that show up—and homeowners who expect clarity" />
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#666666] sm:text-lg">
            From emergency repairs to major renovations, BuildLink links you with verified pros who work like this every day—so expectations, scope, and payment stay honest from quote to completion.
          </p>

          <div className="mt-12 space-y-14 lg:mt-16 lg:space-y-20">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl shadow-xl ring-1 ring-[#163357]/10 lg:mx-0 lg:max-h-[min(480px,65vh)] lg:max-w-none">
                <Image
                  src="/landing/trades-pro-plumber.png"
                  alt="Professional tradesperson in safety gear working on plumbing under a sink"
                  fill
                  className="object-cover object-[center_25%]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ca8a04]">For homeowners</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-[#002D62] sm:text-2xl">Expertise you can trust, not guesswork</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  When something breaks—or you are ready to renovate—you want someone who shows up prepared and communicates clearly. BuildLink helps you hire verified builders and trades with scope, quotes, and milestones in one place.
                </p>
                <Link
                  href="/onboarding/homeowner"
                  className="mt-6 inline-flex min-h-11 touch-manipulation items-center justify-center rounded-lg bg-[#22c55e] px-5 text-sm font-semibold text-white shadow-md transition hover:bg-[#16a34a]"
                >
                  Post a job
                </Link>
              </div>
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="order-2 lg:order-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ea580c]">For builders &amp; trades</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-[#002D62] sm:text-2xl">Serious work deserves serious leads</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#666666] sm:text-[15px]">
                  You are not looking for random clicks—you want jobs that fit your skills, your area, and how you run a site. BuildLink matches you with homeowners who are ready to move, with workflows that protect your time and your payment.
                </p>
                <Link
                  href="/onboarding/builder"
                  className="mt-6 inline-flex min-h-11 touch-manipulation items-center justify-center rounded-lg border border-[#163357]/20 bg-white px-5 text-sm font-semibold text-[#002D62] shadow-sm transition hover:border-[#163357]/40 hover:bg-[#f8fafc]"
                >
                  Join BuildLink
                </Link>
              </div>
              <div className="relative order-1 mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl shadow-xl ring-1 ring-[#163357]/10 lg:order-2 lg:mx-0 lg:max-h-[min(480px,65vh)] lg:max-w-none">
                <Image
                  src="/landing/builder-site-foreman.png"
                  alt="Construction professional in high-visibility vest and hard hat on a building site"
                  fill
                  className="object-cover object-[center_20%]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e8eef4] bg-white">
        <div className="container-app py-14 sm:py-16 lg:py-20">
          <SectionTitle eyebrow="Platform" title="We bring everything into one calm workflow" />
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#666666] sm:text-lg">
            From first brief to final payment, BuildLink keeps both sides aligned—so you spend less time chasing and more time building.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {features.map((f) => (
              <article
                key={f.title}
                className="group rounded-2xl border border-[#e8eef4] bg-white p-6 shadow-sm transition hover:border-[#22c55e]/35 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0fdf4] text-xs font-bold text-[#15803d] ring-1 ring-[#22c55e]/20">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#002D62]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#666666] sm:text-[15px]">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e8eef4] bg-[#fafbfc] py-14 sm:py-16 lg:py-20">
        <div className="container-app">
          <SectionTitle title="Questions, answered plainly" />
          <div className="mt-8 space-y-3 sm:mt-10">
            {faqs.map((item, index) => (
              <div key={item.q} className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
                <button
                  type="button"
                  className="flex min-h-14 w-full touch-manipulation items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-[#002D62] sm:text-base"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                >
                  <span className="pr-2">{item.q}</span>
                  <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0fdf4] text-[#15803d]" aria-hidden>
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>
                {openFaq === index ? (
                  <p className="border-t border-[#e8eef4] px-5 py-4 text-sm leading-relaxed text-[#666666] sm:text-[15px]">{item.a}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#0f2744] bg-[#163357] py-12 pb-safe text-center text-white/80">
        <div className="container-app flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
          <Link href="/about" className="touch-manipulation min-h-11 inline-flex items-center hover:text-white">
            About
          </Link>
          <Link href="/contact" className="touch-manipulation min-h-11 inline-flex items-center hover:text-white">
            Contact
          </Link>
          <Link href="/privacy" className="touch-manipulation min-h-11 inline-flex items-center hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="touch-manipulation min-h-11 inline-flex items-center hover:text-white">
            Terms
          </Link>
        </div>
        <p className="container-app mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/55 sm:text-sm">
          © {new Date().getFullYear()}{" "}
          <LogoWordmark />
          . Acquisition · marketplace · projects · payments & trust.
        </p>
      </footer>
    </div>
  );
}
