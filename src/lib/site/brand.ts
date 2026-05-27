import { yearsOfExperience } from "@/lib/site/company";
import type { SiteStat } from "@/types/site-stat";

/** Local marketing imagery (files in public/media/). */
export const brandImages = {
  hero: "/hero/hero2.jpeg",
  galleryIndustrial: "/media/photo-industrial.avif",
  galleryAgricultural: "/media/plant-soil.avif",
  intro: "/media/photo-industrial.avif",
  testimonial: "/media/plant-soil.avif",
  whyChooseFeatured: "/media/machine.jpeg",
} as const;

export type HeroSlide = {
  src: string;
  alt: string;
};

/** Hero background slideshow — public/hero/ plus legacy hero image. */
export const heroSlides: HeroSlide[] = [
  {
    src: "/hero/hero2.jpeg",
    alt: "Industrial and agricultural machinery",
  },
  {
    src: "/Agricultural_machinery.jpg",
    alt: "Agricultural machinery in the field",
  },
  {
    src: "/hero/hero3.jpeg",
    alt: "XON machinery on site",
  },
  {
    src: "/hero/heropumps.jpeg",
    alt: "Pump and fluid equipment",
  },
  {
    src: "/hero/pump1.jpeg",
    alt: "Industrial pump equipment",
  },
  {
    src: "/hero/pump2.jpeg",
    alt: "Pump machinery for commercial use",
  },
];

/**
 * Home featured-category row — fixed labels, images, and catalog slugs.
 * Create matching collections in admin (same slugs) so /products?category=… filters work.
 */
export const homeFeaturedCategories = [
  {
    name: "Atlas Copco Compressors",
    href: "/products?category=atlas-copco-compressors",
    image: "/media/machine.jpeg",
  },
  {
    name: "Cement Mixing Machines",
    href: "/products?category=cement-mixing-machines",
    image: "/media/diesel_site_mixer.png",
  },
  {
    name: "Cranes",
    href: "/products?category=cranes",
    image: "/media/industrial-crane-saudi-arabia--560x416.png",
  },
  {
    name: "Diver/Vacuum Pumps",
    href: "/products?category=diver-vacuum-pumps",
    image: "/media/Two-Stage-Vacuum-Pump.jpg.bv_resized_mobile.jpg.bv.webp",
  },
  {
    name: "Mining Compressors",
    href: "/products?category=mining-compressors",
    image:
      "/media/Zimbabwe-Gold-Mining-Diesel-Air-Compressor-with-Hand-Rock-Drill.webp",
  },
] as const;

/** Fallback image when a collection has no custom artwork. */
export function getCollectionFeaturedImage(slug: string): string {
  if (slug.includes("agricultural")) {
    return brandImages.galleryAgricultural;
  }
  if (slug.includes("industrial")) {
    return brandImages.galleryIndustrial;
  }
  return brandImages.hero;
}

export const whyChooseItems = [
  {
    title: "Durable Machinery",
    description:
      "Equipment selected for long service life in demanding farm and industrial environments.",
    icon: "shield" as const,
  },
  {
    title: "Affordable Pricing",
    description:
      "Competitive rates with clear quotes—no hidden fees when you inquire on WhatsApp.",
    icon: "wallet" as const,
  },
  {
    title: "Trusted Support",
    description:
      "Guidance from inquiry through delivery so you choose the right machine for the job.",
    icon: "headphones" as const,
  },
  {
    title: "Fast Response",
    description:
      "Quick replies on WhatsApp for availability, specs, and order arrangements.",
    icon: "zap" as const,
  },
  {
    title: "Industry Expertise",
    description:
      "Deep knowledge of industrial and agricultural equipment categories we supply.",
    icon: "award" as const,
  },
  {
    title: "Quality Equipment",
    description:
      "Machinery that meets professional standards for performance and reliability.",
    icon: "check" as const,
  },
] as const;

export const processSteps = [
  {
    step: 1,
    icon: "layout-grid" as const,
    title: "Browse Products",
    description:
      "Explore our catalog of industrial and agricultural machines with photos and specifications.",
  },
  {
    step: 2,
    icon: "message-circle" as const,
    title: "Contact via WhatsApp",
    description:
      "Send an inquiry with your product of interest—we confirm pricing and availability.",
  },
  {
    step: 3,
    icon: "truck" as const,
    title: "Complete Order & Delivery",
    description:
      "Finalize your order and arrange delivery or pickup with our team directly.",
  },
] as const;

export const trustStats: SiteStat[] = [
  {
    kind: "counter",
    value: yearsOfExperience,
    suffix: "+",
    label: "Years of Experience",
  },
  { kind: "counter", value: 2, label: "Sectors Served" },
  { kind: "static", display: "24/7", label: "Inquiry Support" },
];

export const heroTrustBar = [
  {
    title: "Quality Products",
    description: "Genuine & reliable industrial equipment",
    icon: "shield" as const,
  },
  {
    title: "Expert Support",
    description: "Technical support from our experts",
    icon: "cog" as const,
  },
  {
    title: "Fast Delivery",
    description: "Across Nigeria & beyond",
    icon: "truck" as const,
  },
  {
    title: "Customer Satisfaction",
    description: "Our clients are our top priority",
    icon: "heart" as const,
  },
] as const;
