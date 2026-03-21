import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function AdminPaymentsPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { milestone: true, project: { include: { job: true } } },
    take: 100,
  });

  return (
    <div>
      <SiteHeader />
      <main className="container-app py-6 sm:py-8 pb-safe">
        <h1 className="text-3xl font-semibold">Payments</h1>
        <p className="mt-2 text-stone-600">Track Stripe PaymentIntents, escrow, and refunds (wire Stripe Dashboard in ops).</p>
        <ul className="mt-6 space-y-2">
          {payments.map((p) => (
            <li key={p.id} className="rounded-xl border border-stone-200 bg-white p-4 text-sm">
              £{p.amount.toLocaleString()} {p.currency.toUpperCase()} · {p.status}
              {p.stripePaymentIntentId ? ` · PI ${p.stripePaymentIntentId}` : ""}
              {p.project?.job ? ` · ${p.project.job.title}` : ""}
            </li>
          ))}
          {payments.length === 0 ? <li className="text-stone-600">No payment records yet.</li> : null}
        </ul>
      </main>
    </div>
  );
}
