import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/customer/FadeIn";
import { aboutImages } from "@/lib/site/about";

export function AboutHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-2 lg:min-h-[28rem]">
        <div className="flex flex-col justify-center px-4 py-16 sm:py-20 lg:px-8 lg:py-24">
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-light">
              About XON
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Machinery partners for industry and agriculture
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
              XON Industrial and Agricultural Machineries connects operators
              with dependable equipment—and the people who stand behind it. We
              are built for buyers who value clarity, durability, and direct
              communication.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-light"
              >
                View catalog
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                Get in touch
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.08} className="relative px-4 pb-16 lg:px-8 lg:py-16 lg:pb-16">
          <div className="relative min-h-[280px] overflow-hidden rounded-3xl shadow-[0_12px_48px_-16px_rgba(15,23,42,0.15)] ring-1 ring-slate-200/80 lg:min-h-full">
            <Image
              src={aboutImages.hero}
              alt="Industrial machinery supplied by XON"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
