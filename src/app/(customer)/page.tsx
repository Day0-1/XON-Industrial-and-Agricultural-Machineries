import { CtaSection } from "@/components/customer/home/CtaSection";
import { FaqSection } from "@/components/customer/home/FaqSection";
import { FeaturedProductsSection } from "@/components/customer/home/FeaturedProductsSection";
import { HeroSection } from "@/components/customer/home/HeroSection";
import { BentoIntroSection } from "@/components/customer/home/BentoIntroSection";
import { ProcessSection } from "@/components/customer/home/ProcessSection";
import { TrustSection } from "@/components/customer/home/TrustSection";
import { WhyChooseSection } from "@/components/customer/home/WhyChooseSection";
import { listActiveCollections } from "@/integrations/mongodb/collections";
import { getCollectionFeaturedImage } from "@/lib/site/brand";
import { buildPageMetadata } from "@/lib/seo/metadata";
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
  const collections = await listActiveCollections();
  const featuredCategories = collections.slice(0, 5).map((col) => ({
    name: col.name,
    href: `/products?category=${col.slug}`,
    image: getCollectionFeaturedImage(col.slug),
  }));

  return (
    <>
      <HeroSection whatsappHref={whatsappHref} />
      <BentoIntroSection />
      <FeaturedProductsSection categories={featuredCategories} />
      <WhyChooseSection />
      <ProcessSection />
      <TrustSection />
      <FaqSection />
      <CtaSection whatsappHref={whatsappHref} />
    </>
  );
}
