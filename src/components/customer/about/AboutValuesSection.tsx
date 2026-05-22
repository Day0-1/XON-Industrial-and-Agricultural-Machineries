import Image from "next/image";
import {
  Handshake,
  Headphones,
  MessageCircle,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { BentoCard } from "@/components/customer/BentoCard";
import { FadeIn } from "@/components/customer/FadeIn";
import { aboutImages, aboutValues } from "@/lib/site/about";
import { SectionHeading } from "@/components/customer/home/SectionHeading";

const valueIcons = {
  message: MessageCircle,
  shield: Shield,
  headphones: Headphones,
  handshake: Handshake,
} satisfies Record<(typeof aboutValues)[number]["icon"], LucideIcon>;

export function AboutValuesSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="What we stand for"
            title="Principles behind every recommendation"
            description="Our values are not slogans on a wall—they shape how we quote, how we ship, and how we respond when you need help after installation."
          />
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <FadeIn className="lg:col-span-5">
            <BentoCard className="relative min-h-[320px] overflow-hidden p-0 lg:min-h-full">
              <Image
                src={aboutImages.workshop}
                alt="Engineering workspace and industrial equipment"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
                  Built on trust
                </p>
                <p className="mt-2 text-xl font-semibold leading-snug text-white">
                  Clients return because we tell the truth about lead times,
                  specs, and suitability—not because we chase quick sales.
                </p>
              </div>
            </BentoCard>
          </FadeIn>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {aboutValues.map((value, index) => {
              const Icon = valueIcons[value.icon];
              return (
                <FadeIn key={value.title} delay={0.05 + index * 0.04}>
                  <BentoCard className="flex h-full flex-col">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="mt-4 font-semibold text-slate-900">
                      {value.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {value.description}
                    </p>
                  </BentoCard>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
