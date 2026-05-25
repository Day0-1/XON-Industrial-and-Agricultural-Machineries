import { FadeIn } from "@/components/customer/FadeIn";
import { aboutStats, aboutTagline } from "@/lib/site/about";

export function AboutStatsSection() {
  return (
    <section className="border-t border-slate-200/80 bg-surface py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-slate-600 sm:text-base">
            {aboutTagline}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <dl className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
            {aboutStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="text-3xl font-bold tracking-tight text-brand sm:text-4xl">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-sm font-medium text-slate-600">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
