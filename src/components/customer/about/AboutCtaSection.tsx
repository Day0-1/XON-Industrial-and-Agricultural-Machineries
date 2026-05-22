import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/customer/FadeIn";
import { WhatsAppLink } from "@/components/customer/WhatsAppLink";
import { aboutImages } from "@/lib/site/about";

type AboutCtaSectionProps = {
  whatsappHref: string | null;
};

export function AboutCtaSection({ whatsappHref }: AboutCtaSectionProps) {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-slate-200/80">
            <div className="relative min-h-[280px] sm:min-h-[320px]">
              <Image
                src={aboutImages.workshop}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-slate-950/75"
                aria-hidden
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-14 text-center sm:px-12">
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to find the right machine for your operation?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Tell us about your workload, power needs, or farm scale. We will
                point you to suitable products and follow up on WhatsApp with
                pricing and availability.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {whatsappHref && (
                  <WhatsAppLink
                    href={whatsappHref}
                    variant="whatsapp"
                    className="rounded-full px-6 py-3"
                  >
                    Start on WhatsApp
                  </WhatsAppLink>
                )}
                <Link
                  href="/products"
                  className="inline-flex rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Browse products
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
