import { brandImages } from "@/lib/site/brand";
import { yearsOfExperience } from "@/lib/site/company";
import type { SiteStat } from "@/types/site-stat";

export {
  companyMission,
  companyMotto,
  companyVision,
} from "@/lib/site/company";

export const aboutImages = {
  hero: brandImages.whyChooseFeatured,
  story: brandImages.galleryIndustrial,
  industrial: brandImages.intro,
  agricultural: brandImages.galleryAgricultural,
  field: brandImages.testimonial,
  workshop: brandImages.hero,
} as const;

export const aboutStats: SiteStat[] = [
  {
    kind: "counter",
    value: yearsOfExperience,
    suffix: "+",
    label: "Years of experience",
  },
  { kind: "counter", value: 2, label: "Core sectors served" },
  { kind: "static", display: "NG", label: "Serving Nigeria" },
  { kind: "static", display: "24/7", label: "Inquiry support" },
];

export const aboutTagline = `With ${yearsOfExperience} years of experience, XON supplies industrial and agricultural machinery across Nigeria—with direct support from inquiry through delivery.`;

export const aboutValues = [
  {
    title: "Honest communication",
    description:
      "We quote clearly, explain specifications in plain language, and never pressure you into a purchase. What you see in our catalog is what we discuss on WhatsApp.",
    icon: "message" as const,
  },
  {
    title: "Equipment that lasts",
    description:
      "Industrial and agricultural work is demanding. We prioritize machines built for daily use—reliable power, sturdy frames, and parts you can maintain.",
    icon: "shield" as const,
  },
  {
    title: "Responsive support",
    description:
      "From first inquiry to delivery coordination, you speak with people who know the products—not a ticket queue. Questions get answered quickly.",
    icon: "headphones" as const,
  },
  {
    title: "Partnership mindset",
    description:
      "Whether you run a factory line or a growing farm, we treat every order as a long-term relationship. Many clients return when they expand operations.",
    icon: "handshake" as const,
  },
] as const;

export const aboutFocusAreas = [
  {
    label: "Industrial",
    title: "Powering production and fabrication",
    image: aboutImages.industrial,
    imageAlt: "Industrial welding and manufacturing environment",
    paragraphs: [
      "Factories, workshops, and processing plants depend on machinery that starts on schedule and holds tolerances under load. We supply industrial equipment suited to metalwork, material handling, power generation, and general plant operations.",
      "Our team helps you match capacity, voltage, and footprint to your facility so you avoid overspending on the wrong spec—or underpowering a critical line.",
    ],
  },
  {
    label: "Agricultural",
    title: "Supporting farms from soil to harvest",
    image: aboutImages.agricultural,
    imageAlt: "Young crops in agricultural soil",
    paragraphs: [
      "Farms need machines that cope with dust, weather, and seasonal intensity. We provide agricultural equipment for tillage, planting support, processing, and auxiliary power where fields lack grid access.",
      "We work with growers and agribusinesses who want straightforward advice: which machine fits your acreage, fuel preference, and maintenance capacity before you commit.",
    ],
  },
] as const;

export const aboutApproachSteps = [
  {
    step: "01",
    title: "Discover & specify",
    description:
      "Browse our product catalog or describe your job on WhatsApp. We clarify models, capacities, and compatibility with your site.",
  },
  {
    step: "02",
    title: "Quote & confirm",
    description:
      "Receive pricing and lead times in writing. We confirm stock or order timelines before you proceed—no surprise fees at checkout because orders finalize directly with our team.",
  },
  {
    step: "03",
    title: "Deliver & stay available",
    description:
      "We coordinate delivery or pickup across Nigeria and support surrounding regions. After handover, we remain reachable for operational questions.",
  },
] as const;
