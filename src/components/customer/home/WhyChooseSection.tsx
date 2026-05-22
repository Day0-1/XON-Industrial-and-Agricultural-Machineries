import Image from "next/image";
import {
  Award,
  CheckCircle2,
  Headphones,
  Shield,
  Wallet,
  Zap,
} from "lucide-react";
import { BentoCard } from "@/components/customer/BentoCard";
import { FadeIn } from "@/components/customer/FadeIn";
import { brandImages, whyChooseItems } from "@/lib/site/brand";
import { SectionHeading } from "./SectionHeading";

const iconMap = {
  shield: Shield,
  wallet: Wallet,
  headphones: Headphones,
  zap: Zap,
  award: Award,
  check: CheckCircle2,
} as const;

export function WhyChooseSection() {
  const [featured, ...rest] = whyChooseItems;

  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Why XON"
            title="Everything you need to buy with confidence"
            description="Durable equipment, transparent pricing, and support that stays with you after delivery."
          />
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          <FadeIn className="lg:col-span-2 lg:row-span-2">
            <BentoCard className="relative h-full min-h-[280px] overflow-hidden p-0 lg:min-h-full">
              <Image
                src={brandImages.whyChooseFeatured}
                alt="Industrial and agricultural machinery"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/10" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-white/85">
                  {featured.description}
                </p>
              </div>
            </BentoCard>
          </FadeIn>

          {rest.slice(0, 2).map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <FadeIn key={item.title} delay={0.06 + index * 0.04}>
                <BentoCard className="flex h-full flex-col">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </BentoCard>
              </FadeIn>
            );
          })}

          {rest.slice(2, 4).map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <FadeIn key={item.title} delay={0.14 + index * 0.04}>
                <BentoCard className="flex h-full flex-col">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </BentoCard>
              </FadeIn>
            );
          })}

          <FadeIn delay={0.2} className="lg:col-span-2">
            <BentoCard className="flex h-full flex-col justify-center bg-white sm:flex-row sm:items-center sm:gap-8">
              {rest.slice(4).map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <div key={item.title} className="flex-1 py-2 sm:py-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="mt-3 font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </BentoCard>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
