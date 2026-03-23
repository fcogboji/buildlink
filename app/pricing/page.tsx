import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { getSubscriptionStatusCopy } from "@/lib/billing";
import { ensureUser } from "@/lib/user-sync";

export const metadata = {
  title: "Pricing | BuildLink",
};

type PricingPageProps = {
  searchParams?: Promise<{ upgrade?: string; status?: string; error?: string }>;
};

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const user = await ensureUser();
  const params = (await searchParams) ?? {};
  const showUpgradeNotice = params.upgrade === "builder";
  const showCheckoutRateLimit = params.error === "rate_limit_checkout";
  const status = user?.stripeSubscriptionStatus ?? "NONE";
  const statusText = getSubscriptionStatusCopy(status);

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7]">
      <MarketingHeader />
      <main className="container-app flex-1 py-8 sm:py-10 pb-safe">
        <h1 className="font-serif text-4xl font-bold text-stone-900">Builder pricing</h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          A fair subscription with milestone-based confidence. Builders avoid random lead fees and get access to better matched jobs.
        </p>

        {showUpgradeNotice ? (
          <section className="mt-6 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide">Builder access required</p>
            <p className="mt-1 text-sm">
              {statusText}
            </p>
          </section>
        ) : null}
        {showCheckoutRateLimit ? (
          <section className="mt-4 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide">Please wait before retrying checkout</p>
            <p className="mt-1 text-sm">Too many checkout attempts were made recently. Try again in a few minutes.</p>
          </section>
        ) : null}

        <section className="mt-8 max-w-xl rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-stone-500">BuildLink Pro Builder</p>
          <p className="mt-2 text-5xl font-bold">£99</p>
          <p className="text-sm text-stone-500">per month + optional success fee on completed jobs</p>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-stone-700">
            <li>Priority matching for high-value projects</li>
            <li>Quote analytics and response benchmarking</li>
            <li>Escrow milestone management and dispute support</li>
          </ul>
          <p className="mt-4 text-sm text-stone-600">Sign in to start Stripe checkout (protected API).</p>
          <form action="/api/stripe/checkout" method="POST" className="mt-4">
            <button className="w-full rounded-xl bg-stone-900 px-4 py-3 text-white hover:bg-stone-800" type="submit">
              Start subscription checkout
            </button>
          </form>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
