/** Local marketing imagery (files in public/media/). */
export const brandImages = {
  hero: "/media/photo-hero.avif",
  galleryIndustrial: "/media/photo-industrial.avif",
  galleryAgricultural: "/media/plant-soil.avif",
  intro: "/media/photo-industrial.avif",
  testimonial: "/media/plant-soil.avif",
  whyChooseFeatured: "/media/machine.jpeg",
} as const;

/** Home featured category circles (links to products). */
export const featuredCategories = [
  {
    name: "Industrial",
    href: "/products?category=industrial",
    image: brandImages.galleryIndustrial,
  },
  {
    name: "Agricultural",
    href: "/products?category=agricultural",
    image: brandImages.galleryAgricultural,
  },
  {
    name: "Construction",
    href: "/products",
    image: brandImages.hero,
  },
  {
    name: "Processing",
    href: "/products",
    image: brandImages.intro,
  },
  {
    name: "Heavy Equipment",
    href: "/products",
    image: brandImages.galleryIndustrial,
  },
] as const;

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

export const trustStats = [
  { value: "100+", label: "Machines Delivered" },
  { value: "Trusted", label: "By Businesses" },
  { value: "24/7", label: "WhatsApp Support" },
] as const;

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
