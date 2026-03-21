import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/user-sync";
import { prisma } from "@/lib/prisma";

export default async function BuilderEarningsPage() {
  const user = await ensureUser();
  if (!user) redirect("/sign-in");

  const payments = await prisma.payment.findMany({
    where: { project: { builderId: user.id } },
    include: { project: { include: { job: true } }, milestone: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const released = payments.filter((p) => p.status === "RELEASED").reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Earnings</h1>
      <p className="mt-2 text-stone-600">Stripe Connect payouts — wire up PaymentIntents to populate this table.</p>
      <p className="mt-4 text-2xl font-semibold">Released (DB): £{released.toLocaleString()}</p>

      <ul className="mt-8 space-y-2">
        {payments.map((pay) => (
          <li key={pay.id} className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm">
            <span className="font-medium">{pay.project?.job.title ?? "Payment"}</span>
            <span className="text-stone-600"> · £{pay.amount.toLocaleString()} · {pay.status}</span>
          </li>
        ))}
        {payments.length === 0 ? <li className="text-stone-600">No payment rows yet.</li> : null}
      </ul>
    </div>
  );
}
