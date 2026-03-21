import type { ReactNode } from "react";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";

type MarketingPageProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function MarketingPage({ title, subtitle, children }: MarketingPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7] text-stone-900">
      <MarketingHeader />
      <main className="container-app flex-1 py-10 sm:py-12 lg:py-14">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">{subtitle}</p> : null}
        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-stone-700 sm:text-[17px]">{children}</div>
      </main>
      <MarketingFooter />
    </div>
  );
}
