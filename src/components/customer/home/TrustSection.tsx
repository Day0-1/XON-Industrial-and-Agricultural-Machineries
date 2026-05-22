import Image from "next/image";
import { Quote } from "lucide-react";
import { BentoCard } from "@/components/customer/BentoCard";
import { FadeIn } from "@/components/customer/FadeIn";
import { brandImages, trustStats } from "@/lib/site/brand";

export function TrustSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {trustStats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.06}>
              <div className=" py-10 text-center">
                <p className="text-4xl font-bold tracking-tight text-brand">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {stat.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
        <br />
        <br />

        <FadeIn delay={0.1} className="mt-4">
          <div className="grid overflow-hidden rounded-3xl shadow-[0_12px_48px_-16px_rgba(15,23,42,0.15)] ring-1 ring-slate-200/80 lg:grid-cols-5">
            <div className="relative min-h-[280px] lg:col-span-2 lg:min-h-[360px]">
              <Image
                src={brandImages.testimonial}
                alt="Healthy crops in agricultural field"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <BentoCard
              as="article"
              className="flex flex-col justify-center rounded-none border-0 shadow-none ring-0 lg:col-span-3 lg:rounded-none lg:rounded-r-3xl"
            >
              <Quote className="h-10 w-10 text-brand/40" aria-hidden />
              <blockquote className="mt-6 text-xl font-medium leading-relaxed text-slate-900 sm:text-2xl">
                &ldquo;XON helped us source reliable equipment quickly. WhatsApp
                support made pricing and delivery straightforward.&rdquo;
              </blockquote>
              <footer className="mt-8">
                <p className="font-semibold text-slate-900">Operations Manager</p>
                <p className="text-sm text-slate-500">
                  Agricultural business client
                </p>
              </footer>
            </BentoCard>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
