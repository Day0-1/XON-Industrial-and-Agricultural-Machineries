import {
  defaultContactEmail,
  defaultContactPhone,
} from "@/lib/site/company";

export function getContactEmail(): string {
  return process.env.CONTACT_EMAIL?.trim() || defaultContactEmail;
}

export function getContactPhone(): string {
  const phone = process.env.CONTACT_PHONE?.trim();
  return phone && phone.length > 0 ? phone : defaultContactPhone;
}

/** Human-readable phone for UI (e.g. +234 705 323 6255). */
export function formatContactPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234") && digits.length >= 13) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return phone;
}

export type StoreLocation = {
  id: string;
  name: string;
  lines: readonly string[];
  /** Shown on the embedded map when true (first primary wins). */
  isPrimary?: boolean;
};

export const storeLocations: readonly StoreLocation[] = [
  {
    id: "aswani",
    name: "Aswani Market",
    lines: [
      "Block D12, Aswani Market",
      "Plaza, Airport Road",
      "Lagos",
    ],
    isPrimary: true,
  },
  {
    id: "alaba",
    name: "Alaba International Market",
    lines: ["Shop F73/F74", "Alaba International Market", "Lagos"],
  },
  {
    id: "arena",
    name: "Arena Shopping Complex",
    lines: ["Arena Shopping Complex", "Lagos"],
  },
] as const;

const defaultMapEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.8671692844437!2d3.3294458249952905!3d6.538453872989391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8e7198e003c7%3A0xc45a23375356586a!2sAswani%20Market!5e0!3m2!1sen!2sng!4v1779704446190!5m2!1sen!2sng";

export function getPrimaryStore(): StoreLocation {
  return storeLocations.find((s) => s.isPrimary) ?? storeLocations[0];
}

export function getOtherStores(): StoreLocation[] {
  const primary = getPrimaryStore();
  return storeLocations.filter((s) => s.id !== primary.id);
}

/** General business location for header, footer, and site-wide contact line. */
export const defaultContactLocation = "Lagos, Nigeria";

export function getContactLocation(): string {
  return process.env.CONTACT_LOCATION?.trim() || defaultContactLocation;
}

/** @deprecated Use getPrimaryStore / storeLocations */
export function getContactAddressLines(): string[] {
  return [...getPrimaryStore().lines];
}

export const contactWorkingHours = [
  { label: "Mon – Fri", value: "8:00 AM – 6:00 PM" },
  { label: "Saturday", value: "9:00 AM – 2:00 PM" },
] as const;

export type SocialLinkId = "facebook" | "linkedin" | "instagram" | "youtube";

export type SocialLink = {
  id: SocialLinkId;
  label: string;
  href: string;
};

export function getSocialLinks(): SocialLink[] {
  const entries: Array<{ id: SocialLinkId; label: string; envKey: string }> = [
    { id: "facebook", label: "Facebook", envKey: "CONTACT_FACEBOOK_URL" },
    { id: "linkedin", label: "LinkedIn", envKey: "CONTACT_LINKEDIN_URL" },
    { id: "instagram", label: "Instagram", envKey: "CONTACT_INSTAGRAM_URL" },
    { id: "youtube", label: "YouTube", envKey: "CONTACT_YOUTUBE_URL" },
  ];

  return entries
    .map(({ id, label, envKey }) => {
      const href = process.env[envKey]?.trim();
      return href ? { id, label, href } : null;
    })
    .filter((item): item is SocialLink => item !== null);
}

/** Google Maps embed — primary store (Aswani Market). Override with CONTACT_MAP_EMBED_URL. */
export function getContactMapEmbedUrl(): string {
  const custom = process.env.CONTACT_MAP_EMBED_URL?.trim();
  if (custom) return custom;
  return defaultMapEmbedUrl;
}
