"use client";

import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import type { SiteStat } from "@/types/site-stat";
import { isCounterStat } from "@/types/site-stat";

type StatFigureProps = {
  stat: SiteStat;
  valueClassName?: string;
  labelClassName?: string;
};

export function StatFigure({
  stat,
  valueClassName = "text-3xl font-bold tracking-tight text-brand sm:text-4xl",
  labelClassName = "mt-2 text-sm font-medium text-slate-600",
}: StatFigureProps) {
  const valueNode = isCounterStat(stat) ? (
    <AnimatedCounter
      value={stat.value}
      suffix={stat.suffix}
      prefix={stat.prefix}
      className={valueClassName}
    />
  ) : (
    <span className={`tabular-nums ${valueClassName}`}>{stat.display}</span>
  );

  return (
    <div className="flex flex-col items-center text-center">
      {valueNode}
      <p className={labelClassName}>{stat.label}</p>
    </div>
  );
}
