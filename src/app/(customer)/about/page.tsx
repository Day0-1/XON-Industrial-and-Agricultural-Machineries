import { AboutApproachSection } from "@/components/customer/about/AboutApproachSection";
import { AboutLocationSection } from "@/components/customer/about/AboutLocationSection";
import { AboutCtaSection } from "@/components/customer/about/AboutCtaSection";
import { AboutFocusSection } from "@/components/customer/about/AboutFocusSection";
import { AboutHeroSection } from "@/components/customer/about/AboutHeroSection";
import { PartnerLogoMarquee } from "@/components/customer/PartnerLogoMarquee";
import { AboutStatsSection } from "@/components/customer/about/AboutStatsSection";
import { AboutStorySection } from "@/components/customer/about/AboutStorySection";
import { AboutValuesSection } from "@/components/customer/about/AboutValuesSection";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn about XON—28+ years supplying industrial and agricultural machinery in Nigeria. Our mission, vision, and motto: Let's keep moving.",
  path: "/about",
});

export default function AboutPage() {
  const whatsappHref = getWhatsAppHref(
    "Hello XON, I would like to learn more about your company and machineries.",
  );

  return (
    <>
      <AboutHeroSection />
      <PartnerLogoMarquee showHeading />
      <AboutStatsSection />
      <AboutStorySection />
      <AboutFocusSection />
      <AboutValuesSection />
      <AboutApproachSection />
      <AboutLocationSection />
      <AboutCtaSection whatsappHref={whatsappHref} />
    </>
  );
}
