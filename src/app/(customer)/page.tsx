import { AboutCtaSection } from "@/components/customer/about/AboutCtaSection";
import { FaqSection } from "@/components/customer/home/FaqSection";
import { FeaturedProductsSection } from "@/components/customer/home/FeaturedProductsSection";
import { HeroSection } from "@/components/customer/home/HeroSection";
import { PartnerLogoMarquee } from "@/components/customer/PartnerLogoMarquee";
import { BentoIntroSection } from "@/components/customer/home/BentoIntroSection";
import { ProcessSection } from "@/components/customer/home/ProcessSection";
import { TestimonialsSection } from "@/components/customer/home/TestimonialsSection";
import { TrustSection } from "@/components/customer/home/TrustSection";
import { WhyChooseSection } from "@/components/customer/home/WhyChooseSection";
import { homeFeaturedCategories } from "@/lib/site/brand";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteFaqs } from "@/lib/site/faq";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const metadata = buildPageMetadata({
  title: "Home",
  description:
    "Quality industrial and agricultural machinery from XON. Browse products and inquire via WhatsApp.",
  path: "/",
});

export default async function HomePage() {
  const whatsappHref = getWhatsAppHref(
    "Hello XON, I would like to inquire about your machineries.",
  );
  return (
    <>
      <FaqJsonLd faqs={siteFaqs} />
      <HeroSection whatsappHref={whatsappHref} />
      <PartnerLogoMarquee />
      <BentoIntroSection />
      <FeaturedProductsSection categories={[...homeFeaturedCategories]} />
      <WhyChooseSection />
      <ProcessSection />
      <TrustSection />
      <TestimonialsSection />
      <FaqSection />
      <AboutCtaSection whatsappHref={whatsappHref} />
    </>
  );
}
