"use client";

import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { formatClickCount } from "@/lib/admin/format";

type StatCardProps = {
  label: string;
  value: string;
  count?: number;
  useCompactCountFormat?: boolean;
  hint?: string;
  trend?: { value: string; positive?: boolean };
};

export function StatCard({
  label,
  value,
  count,
  useCompactCountFormat = false,
  hint,
  trend,
}: StatCardProps) {
  const formatCount = useCompactCountFormat
    ? (n: number) => formatClickCount(Math.round(n))
    : (n: number) => Math.round(n).toLocaleString();

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {count !== undefined ? (
        <AnimatedCounter
          value={count}
          format={formatCount}
          className="mt-2 block text-3xl font-bold tracking-tight text-slate-900"
        />
      ) : (
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
      )}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {trend && (
        <span
          className={`mt-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            trend.positive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {trend.value}
        </span>
      )}
    </div>
  );
}
