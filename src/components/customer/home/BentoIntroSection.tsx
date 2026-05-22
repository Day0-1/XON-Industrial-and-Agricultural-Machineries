import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardList,
  Factory,
  MessageCircle,
  Tractor,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { BentoCard } from "@/components/customer/BentoCard";
import { FadeIn } from "@/components/customer/FadeIn";
import { brandImages } from "@/lib/site/brand";
import { SectionHeading } from "./SectionHeading";

const galleryTiles = [
  {
    src: brandImages.galleryIndustrial,
    alt: "Industrial welding and manufacturing",
    label: "Industrial",
    icon: Factory,
  },
  {
    src: brandImages.galleryAgricultural,
    alt: "Young crops growing in agricultural soil",
    label: "Agricultural",
    icon: Tractor,
  },
] as const;

const highlightItems = [
  {
    title: "Clear specs",
    desc: "Full details before you buy",
    icon: ClipboardList,
  },
  {
    title: "Fair pricing",
    desc: "Quotes via WhatsApp",
    icon: Wallet,
  },
  {
    title: "Fast replies",
    desc: "Direct team contact",
    icon: MessageCircle,
  },
  {
    title: "Delivery help",
    desc: "Logistics arranged with you",
    icon: Truck,
  },
] as const satisfies ReadonlyArray<{
  title: string;
  desc: string;
  icon: LucideIcon;
}>;

export function BentoIntroSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="About XON"
            title="Built for operators who need machines that deliver"
            description="From factory floors to farmland—we supply equipment with clear specs, fair pricing, and human support."
          />
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {galleryTiles.map((tile, index) => {
            const Icon = tile.icon;
            return (
              <FadeIn key={tile.label} delay={index * 0.06}>
                <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl shadow-[0_12px_48px_-16px_rgba(15,23,42,0.2)] ring-1 ring-slate-200/80">
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-lg font-bold text-white">
                      {tile.label}
                    </span>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <FadeIn className="flex flex-col gap-4 lg:col-span-5">
            <BentoCard className="flex flex-1 flex-col justify-between bg-surface p-8">
              <div>
                <p className="text-sm font-semibold text-brand">Our mission</p>
                <p className="mt-4 text-lg leading-relaxed text-slate-700">
                  Make industrial and agricultural machinery accessible—with
                  honest communication and a straightforward WhatsApp inquiry
                  process.
                </p>
              </div>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-light"
              >
                Learn more
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </BentoCard>
            <BentoCard className="bg-brand p-8 text-black">
              <p className="text-4xl font-bold">10+</p>
              <p className="mt-1 text-sm font-medium text-black/80">
                Years serving industrial &amp; farm clients
              </p>
            </BentoCard>
          </FadeIn>

          <FadeIn delay={0.08} className="lg:col-span-7">
            <BentoCard className="relative min-h-[320px] overflow-hidden p-0 sm:min-h-[380px]">
              <Image
                src={brandImages.intro}
                alt="Industrial manufacturing and welding"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
                  Quality assurance
                </p>
                <p className="mt-2 max-w-md text-xl font-semibold leading-snug text-white sm:text-2xl">
                  Every machine backed by responsive support—from inquiry to
                  delivery.
                </p>
              </div>
            </BentoCard>
          </FadeIn>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlightItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={0.1 + index * 0.04}>
                <BentoCard className="h-full bg-surface p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                </BentoCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
