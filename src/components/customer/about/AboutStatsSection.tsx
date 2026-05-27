import { FadeIn } from "@/components/customer/FadeIn";
import { StatFigure } from "@/components/customer/StatFigure";
import { aboutStats, aboutTagline } from "@/lib/site/about";

export function AboutStatsSection() {
  return (
    <section className="border-t border-slate-200/80 bg-surface py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn delay={0.06}>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <p className="max-w-md text-center text-sm leading-relaxed text-slate-600 sm:text-base lg:text-left">
              {aboutTagline}
            </p>

            <div className="grid min-w-0 flex-1 grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {aboutStats.map((stat) => (
                <StatFigure key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
