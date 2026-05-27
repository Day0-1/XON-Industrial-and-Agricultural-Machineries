import Link from "next/link";
import { FadeIn } from "@/components/customer/FadeIn";
import { LocationMapEmbed } from "@/components/customer/shared/LocationMapEmbed";
import { SectionHeading } from "@/components/customer/home/SectionHeading";

export function AboutLocationSection() {
  return (
    <section className="overflow-x-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto w-full min-w-0 max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Where we are"
            title="Visit us in Lagos"
            description="We operate from multiple locations in Lagos. The map shows our Aswani Market store; see all addresses below or on our contact page."
          />
        </FadeIn>

        <FadeIn delay={0.08} className="min-w-0">
          <div className="mt-12 w-full min-w-0">
            <LocationMapEmbed
              title="Our Location"
              showStoresList
              showContactLink
            />
            <p className="mt-6 text-center text-sm text-slate-600">
              Questions about delivery or site visits?{" "}
              <Link
                href="/contact"
                className="font-semibold text-brand hover:text-brand-light"
              >
                Get in touch on our contact page
              </Link>
              .
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
