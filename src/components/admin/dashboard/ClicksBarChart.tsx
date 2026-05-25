import { formatClickCount, formatClickCountFull } from "@/lib/admin/format";
import type { MonthlyClickPoint } from "@/integrations/mongodb/analytics";

type ClicksBarChartProps = {
  monthlyClicks: MonthlyClickPoint[];
  totalClicks: number;
};

export function ClicksBarChart({ monthlyClicks, totalClicks }: ClicksBarChartProps) {
  const max = Math.max(...monthlyClicks.map((m) => m.clicks), 1);
  const peakIndex = monthlyClicks.reduce(
    (best, point, index) =>
      point.clicks > monthlyClicks[best].clicks ? index : best,
    0,
  );

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)] lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Product clicks overview</p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            {formatClickCount(totalClicks)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {formatClickCountFull(totalClicks)} total views · last 6 months
          </p>
        </div>
      </div>

      <div className="mt-10 flex h-52 items-end justify-between gap-3 sm:gap-4">
        {monthlyClicks.map((point, index) => {
          const height = Math.max(12, (point.clicks / max) * 100);
          const isPeak = index === peakIndex && point.clicks > 0;

          return (
            <div
              key={point.label}
              className="group flex flex-1 flex-col items-center gap-2"
            >
              {point.clicks > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isPeak
                      ? "bg-slate-900 text-white"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {formatClickCount(point.clicks)}
                </span>
              )}
              <div className="relative flex w-full flex-1 items-end">
                <div
                  className={`w-full rounded-2xl transition-all ${
                    isPeak
                      ? "bg-slate-900 shadow-lg shadow-slate-900/25"
                      : "bg-slate-100 group-hover:bg-slate-200"
                  }`}
                  style={{
                    height: `${height}%`,
                    minHeight: "12px",
                    backgroundImage: isPeak
                      ? undefined
                      : "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(148,163,184,0.15) 4px, rgba(148,163,184,0.15) 8px)",
                  }}
                  title={`${point.label}: ${formatClickCountFull(point.clicks)} clicks`}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
