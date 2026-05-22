import Image from "next/image";
import { FadeIn } from "@/components/customer/FadeIn";
import { aboutApproachSteps, aboutImages } from "@/lib/site/about";
export function AboutApproachSection() {
  return (
    <section className="bg-slate-950 py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <div className="max-w-2xl text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              How we work
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              A clear path from question to delivery
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              We deliberately keep ordering human. No anonymous checkout—just a
              conversation that ends with the right machine on your site.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            {aboutApproachSteps.map((item, index) => (
              <FadeIn key={item.step} delay={index * 0.06}>
                <div className="flex gap-6 border-b border-white/10 pb-8 last:border-0 last:pb-0">
                  <span className="text-3xl font-bold tabular-nums text-accent/90">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-white/10">
              <Image
                src={aboutImages.field}
                alt="Agricultural field and crops"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"
                aria-hidden
              />
            </div>
            <p className="mt-6 text-sm leading-relaxed text-white/65">
              Logistics vary by product size and destination. We discuss
              packaging, transport options, and handover expectations up front so
              your team can plan installation or commissioning without guesswork.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
