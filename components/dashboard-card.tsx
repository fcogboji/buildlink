type DashboardCardProps = {
  title: string;
  value: string;
  hint: string;
};

export function DashboardCard({ title, value, hint }: DashboardCardProps) {
  return (
    <article className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm font-medium text-stone-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">{value}</p>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{hint}</p>
    </article>
  );
}
