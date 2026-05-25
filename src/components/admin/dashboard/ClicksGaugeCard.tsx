import { formatClickCount, formatClickCountFull } from "@/lib/admin/format";

type ClicksGaugeCardProps = {
  totalClicks: number;
  activeProducts: number;
  topProductClicks: number;
};

export function ClicksGaugeCard({
  totalClicks,
  activeProducts,
  topProductClicks,
}: ClicksGaugeCardProps) {
  const goal = Math.max(10_000, topProductClicks * 1.25, totalClicks);
  const percent = Math.min(100, Math.round((totalClicks / goal) * 100));

  return (
    <div className="flex h-full flex-col rounded-[28px] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-medium text-slate-500">Engagement goal</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{percent}% of target</p>

      <div className="relative mx-auto mt-6 flex h-40 w-40 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#0f172a ${percent * 3.6}deg, #e2e8f0 ${percent * 3.6}deg)`,
          }}
        />
        <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-3xl font-bold text-slate-900">{percent}%</span>
          <span className="text-xs text-slate-500">clicks goal</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Total clicks</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatClickCount(totalClicks)}
          </p>
          <p className="text-[10px] text-slate-400">
            {formatClickCountFull(totalClicks)}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Live products</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{activeProducts}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-white">
        <p className="text-xs font-medium text-slate-300">Top product</p>
        <p className="mt-1 text-sm font-semibold">
          {formatClickCount(topProductClicks)} clicks
        </p>
      </div>
    </div>
  );
}
