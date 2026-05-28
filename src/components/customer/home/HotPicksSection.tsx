import { FadeIn } from "@/components/customer/FadeIn";
import type { HotPick } from "@/types/hot-pick";
import { HotPicksCarousel } from "./HotPicksCarousel";
import { SectionHeading } from "./SectionHeading";

type HotPicksSectionProps = {
  picks: HotPick[];
};

export function HotPicksSection({ picks }: HotPicksSectionProps) {
  if (picks.length === 0) return null;

  return (
    <section className="bg-surface py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Hot picks"
            title="Latest & announcements"
            description="Swipe through our newest machinery highlights and company updates."
          />
        </FadeIn>
        <FadeIn delay={0.08} className="mt-10 sm:mt-12">
          <HotPicksCarousel picks={picks} />
        </FadeIn>
      </div>
    </section>
  );
}
