import Link from "next/link";
import {
  ArrowRight,
  Cog,
  HeartHandshake,
  Shield,
  Truck,
} from "lucide-react";
import { WhatsAppLink } from "@/components/customer/WhatsAppLink";
import { HeroImageSlideshow } from "@/components/customer/home/HeroImageSlideshow";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { heroSlides, heroTrustBar } from "@/lib/site/brand";
import { companyMotto, yearsOfExperience } from "@/lib/site/company";

const trustIcons = {
  shield: Shield,
  cog: Cog,
  truck: Truck,
  heart: HeartHandshake,
} as const;

type HeroSectionProps = {
  whatsappHref: string | null;
};

export function HeroSection({ whatsappHref }: HeroSectionProps) {
  return (
    <section className="relative w-full">
      {/* Full-viewport hero image + copy (trust bar sits below, not inside) */}
      <div className="relative isolate min-h-svh min-h-dvh w-full overflow-hidden">
        <div className="absolute inset-0">
          <HeroImageSlideshow slides={heroSlides} />
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-slate-900/35"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/25 to-transparent md:from-slate-950/70"
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex min-h-svh min-h-dvh flex-col justify-end">
          <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-[max(4.75rem,12svh)] sm:px-6 sm:pb-12 sm:pt-[max(5.5rem,14svh)] lg:pb-16 lg:pt-[max(6rem,16svh)]">
            <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-sm sm:tracking-[0.2em]">
              XON Machineries ·{" "}
              <AnimatedCounter
                value={yearsOfExperience}
                suffix="+ years"
                duration={1.6}
                className="inline"
              />
            </p>
              <p className="mt-2 text-sm font-semibold italic text-accent sm:text-base">
                {companyMotto}
              </p>
              <h1 className="mt-3 text-[clamp(1.75rem,6vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-white sm:mt-4">
                Reliable Industrial &amp; Agricultural Machinery Solutions
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base lg:text-lg">
                Nigeria&apos;s partner for top-tier industrial machinery and
                technical services. Browse our catalog and inquire on WhatsApp with
                our team.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all hover:bg-brand-light hover:shadow-xl sm:w-auto"
                >
                  View Products
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                {whatsappHref && (
                  <WhatsAppLink
                    href={whatsappHref}
                    variant="whatsapp"
                    className="w-full rounded-full px-6 py-3.5 sm:w-auto"
                  >
                    Contact on WhatsApp
                  </WhatsAppLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-slate-950">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-4 lg:gap-6">
          {heroTrustBar.map((item) => {
            const Icon = trustIcons[item.icon];
            return (
              <div key={item.title} className="flex items-start gap-3 sm:gap-4">
                <Icon
                  className="h-9 w-9 shrink-0 text-accent sm:h-10 sm:w-10"
                  strokeWidth={1.25}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
