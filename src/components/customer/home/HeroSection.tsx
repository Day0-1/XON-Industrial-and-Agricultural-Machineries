import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cog,
  HeartHandshake,
  Shield,
  Truck,
} from "lucide-react";
import { WhatsAppLink } from "@/components/customer/WhatsAppLink";
import { brandImages, heroTrustBar } from "@/lib/site/brand";

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
    <section className="relative min-h-svh  w-full mt-20">
      <Image
        src={brandImages.hero}
        alt="Engineering and industrial technology workspace"
        fill
        priority
        className="object-cover min-h-svh"
        sizes="100vw"
        quality={100}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-900/25"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end">
        <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-28 sm:pb-14 sm:pt-32 lg:pb-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              XON Machineries
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Reliable Industrial &amp; Agricultural Machinery Solutions
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Quality equipment for farms and industry. Browse our catalog and
              complete inquiries directly on WhatsApp with our team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all hover:bg-brand-light hover:shadow-xl"
              >
                View Products
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              {whatsappHref && (
                <WhatsAppLink
                  href={whatsappHref}
                  variant="whatsapp"
                  className="rounded-full px-6 py-3"
                >
                  Contact on WhatsApp
                </WhatsAppLink>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-slate-950">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-6 lg:py-10">
            {heroTrustBar.map((item) => {
              const Icon = trustIcons[item.icon];
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4"
                >
                  <Icon
                    className="h-10 w-10 shrink-0 text-accent"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm font-bold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
