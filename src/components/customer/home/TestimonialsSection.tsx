import { FadeIn } from "@/components/customer/FadeIn";
import { testimonials } from "@/lib/site/testimonials";
import { SectionHeading } from "./SectionHeading";
import { TestimonialsCarousel } from "./TestimonialsCarousel";

export function TestimonialsSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <SectionHeading
              eyebrow="Testimonial"
              title="What Our Clients Say"
              description="Businesses across Nigeria trust XON for industrial and agricultural machinery—with support that continues after delivery."
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <TestimonialsCarousel items={testimonials} />
        </FadeIn>
      </div>
    </section>
  );
}
