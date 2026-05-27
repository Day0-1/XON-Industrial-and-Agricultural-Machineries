import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { FadeIn } from "@/components/customer/FadeIn";
import { WhatsAppLink } from "@/components/customer/WhatsAppLink";
import { aboutImages } from "@/lib/site/about";
import { companyMotto } from "@/lib/site/company";
import { getContactEmail } from "@/lib/site/contact";

type AboutCtaSectionProps = {
  whatsappHref: string | null;
  eyebrow?: string;
  title?: string;
  description?: string;
  whatsAppLabel?: string;
};

const defaultTitle = "Ready to find the right machine for your operation?";
const defaultDescription =
  "Tell us about your workload, power needs, or farm scale. We will point you to suitable products and follow up on WhatsApp with pricing and availability.";

export function AboutCtaSection({
  whatsappHref,
  eyebrow = "Get started",
  title = defaultTitle,
  description = defaultDescription,
  whatsAppLabel = "Start on WhatsApp",
}: AboutCtaSectionProps) {
  const email = getContactEmail();

  return (
    <section className="bg-surface py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <div className="relative overflow-hidden rounded-4xl shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/80">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <Image
                src={aboutImages.workshop}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1152px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/80 to-slate-950/50" />
            </div>

            <div className="relative px-5 py-10 text-center sm:px-12 sm:py-14">
              {eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white sm:text-sm">
                  {eyebrow}
                </p>
              )}
              <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-white sm:mx-auto sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                {title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-lg">
                {description}
              </p>
              <p className="mt-3 text-sm italic text-white/60">{companyMotto}</p>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
                {whatsappHref && (
                  <WhatsAppLink
                    href={whatsappHref}
                    variant="whatsapp"
                    className="justify-center rounded-full px-6 py-3 shadow-lg shadow-emerald-900/30 sm:w-auto"
                  >
                    {whatsAppLabel}
                  </WhatsAppLink>
                )}
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Browse products
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  Contact us
                </Link>
              </div>

              {email && (
                <p className="mt-6 break-all text-sm text-white/55 sm:break-normal">
                  Or email{" "}
                  <a
                    href={`mailto:${email}`}
                    className="font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
                  >
                    {email}
                  </a>
                </p>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
