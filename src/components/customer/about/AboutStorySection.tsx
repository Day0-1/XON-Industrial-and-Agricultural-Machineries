import Image from "next/image";
import { FadeIn } from "@/components/customer/FadeIn";
import { aboutImages } from "@/lib/site/about";
import { SectionHeading } from "@/components/customer/home/SectionHeading";

export function AboutStorySection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <SectionHeading
            align="left"
            eyebrow="Our story"
            title="From supply to partnership"
            description="XON began with a simple belief: buying machinery should not feel opaque or risky."
          />
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_16px_48px_-20px_rgba(15,23,42,0.25)] ring-1 ring-slate-200/80">
              <Image
                src={aboutImages.story}
                alt="Industrial manufacturing and metalwork"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
            <blockquote className="mt-8 border-l-4 border-brand pl-6">
              <p className="text-lg font-medium leading-relaxed text-slate-800">
                &ldquo;We sell machines, but our work is really about helping
                operators make confident decisions.&rdquo;
              </p>
              <footer className="mt-3 text-sm text-slate-500">
                — The XON team
              </footer>
            </blockquote>
          </FadeIn>

          <FadeIn delay={0.08} className="space-y-6 lg:col-span-7">
            <div className="space-y-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              <p>
                XON Industrial and Agricultural Machineries was established to
                serve two worlds that share the same demand for reliability:
                factory floors and farmland. Over more than a decade, we have
                supplied generators, processing equipment, workshop tools, and
                farm machinery to clients who cannot afford downtime.
              </p>
              <p>
                Early on we saw a gap in the market—buyers were quoted over the
                phone without clear specifications, or steered toward stock that
                did not fit their workload. We built XON around transparency:
                detailed product pages, photos you can inspect, and a WhatsApp
                channel where specialists answer technical questions before money
                changes hands.
              </p>
              <p>
                Today we work with small workshops scaling up production,
                agribusinesses expanding acreage, and established plants
                replacing aging units. Our catalog spans industrial and
                agricultural categories, but our approach stays consistent:
                understand the job, recommend the right machine, and follow
                through on delivery logistics.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface p-6 ring-1 ring-slate-100">
                <p className="text-sm font-semibold uppercase tracking-wider text-brand">
                  Mission
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Make quality industrial and agricultural machinery accessible
                  through honest communication and a straightforward inquiry
                  process.
                </p>
              </div>
              <div className="rounded-2xl bg-brand/5 p-6 ring-1 ring-brand/10">
                <p className="text-sm font-semibold uppercase tracking-wider text-brand">
                  Vision
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Become the most trusted machinery partner in our region—known
                  for equipment that performs and support that answers.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
