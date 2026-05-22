import Image from "next/image";
import { Factory, Tractor } from "lucide-react";
import { FadeIn } from "@/components/customer/FadeIn";
import { aboutFocusAreas } from "@/lib/site/about";
import { SectionHeading } from "@/components/customer/home/SectionHeading";

const focusIcons = {
  Industrial: Factory,
  Agricultural: Tractor,
} as const;

export function AboutFocusSection() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="What we supply"
            title="Two sectors, one standard of quality"
            description="Whether your site is a plant or a plot, we apply the same rigor to sourcing, specification, and after-sale support."
          />
        </FadeIn>

        <div className="mt-14 space-y-20">
          {aboutFocusAreas.map((area, index) => {
            const Icon = focusIcons[area.label];
            const imageFirst = index % 2 === 1;

            return (
              <FadeIn key={area.label} delay={index * 0.06}>
                <article className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div
                    className={`relative aspect-[16/11] overflow-hidden rounded-3xl shadow-[0_12px_48px_-16px_rgba(15,23,42,0.2)] ring-1 ring-slate-200/80 ${
                      imageFirst ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={area.image}
                      alt={area.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute bottom-5 left-5 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                        {area.label}
                      </span>
                    </div>
                  </div>

                  <div className={imageFirst ? "lg:order-1" : ""}>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {area.title}
                    </h3>
                    <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600">
                      {area.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
