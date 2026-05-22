import { AboutApproachSection } from "@/components/customer/about/AboutApproachSection";
import { AboutCtaSection } from "@/components/customer/about/AboutCtaSection";
import { AboutFocusSection } from "@/components/customer/about/AboutFocusSection";
import { AboutHeroSection } from "@/components/customer/about/AboutHeroSection";
import { AboutStatsSection } from "@/components/customer/about/AboutStatsSection";
import { AboutStorySection } from "@/components/customer/about/AboutStorySection";
import { AboutValuesSection } from "@/components/customer/about/AboutValuesSection";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn about XON Industrial and Agricultural Machineries—our story, values, and how we help businesses and farms source reliable equipment.",
  path: "/about",
});

export default function AboutPage() {
  const whatsappHref = getWhatsAppHref(
    "Hello XON, I would like to learn more about your company and machineries.",
  );

  return (
    <>
      <AboutHeroSection />
      <AboutStatsSection />
      <AboutStorySection />
      <AboutFocusSection />
      <AboutValuesSection />
      <AboutApproachSection />
      <AboutCtaSection whatsappHref={whatsappHref} />
    </>
  );
}
