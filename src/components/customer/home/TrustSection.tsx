import { FadeIn } from "@/components/customer/FadeIn";
import { StatFigure } from "@/components/customer/StatFigure";
import { trustStats } from "@/lib/site/brand";

export function TrustSection() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {trustStats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.06}>
              <StatFigure
                stat={stat}
                valueClassName="text-4xl font-bold tracking-tight text-brand"
                labelClassName="mt-2 text-sm font-medium text-slate-600"
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
