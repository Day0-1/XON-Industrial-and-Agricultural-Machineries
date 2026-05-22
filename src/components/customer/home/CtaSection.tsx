import Link from "next/link";
import { Mail } from "lucide-react";
import { getContactEmail } from "@/lib/site/contact";
import { FadeIn } from "@/components/customer/FadeIn";
import { WhatsAppLink } from "@/components/customer/WhatsAppLink";
import Image from "next/image";

type CtaSectionProps = {
  whatsappHref: string | null;
};

export function CtaSection({ whatsappHref }: CtaSectionProps) {
  const email = getContactEmail();

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem]  px-8  text-center  sm:px-16">
          
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                Need reliable machinery for your business?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
                Tell us what you need—we will respond with availability,
                pricing, and next steps.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {whatsappHref && (
                  <WhatsAppLink href={whatsappHref} variant="whatsapp">
                    Contact on WhatsApp
                  </WhatsAppLink>
                )}
                
                <Link
                  href="/products"
                  className="inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-slate-100"
                >
                  Browse products
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
        <Image src="/media/exploded-2.jfif" alt="CTA" width={1000} height={1000} className="w-full h-[500px] object-contain" />
      </div>
    </section>
  );
}
