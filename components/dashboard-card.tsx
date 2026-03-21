type DashboardCardProps = {
  title: string;
  value: string;
  hint: string;
};

export function DashboardCard({ title, value, hint }: DashboardCardProps) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5">
      <p className="text-sm text-stone-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-stone-900">{value}</p>
      <p className="mt-2 text-sm text-stone-600">{hint}</p>
    </article>
  );
}
