export const siteConfig = {
  name: "XON Industrial and Agricultural Machineries",
  shortName: "XON Machineries",
  description:
    "Supplier of industrial and agricultural machinery. Browse products and complete inquiries via WhatsApp.",
  keywords: [
    "XON machineries",
    "industrial machinery",
    "agricultural machinery",
    "farm equipment",
    "industrial equipment Nigeria",
    "agricultural equipment",
  ],
  locale: "en_NG",
};

/** Default share image at public/xon_opengraph.png */
export const defaultSocialImage = {
  path: "/xon_opengraph.png",
  width: 1200,
  height: 630,
  alt: "XON Industrial and Agricultural Machineries",
} as const;

export function getTwitterHandle(): string | undefined {
  const handle = process.env.NEXT_PUBLIC_TWITTER_HANDLE?.trim();
  if (!handle) return undefined;
  return handle.startsWith("@") ? handle : `@${handle}`;
}

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return url && url.length > 0 ? url.replace(/\/$/, "") : "http://localhost:3000";
}

export function resolveSiteImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
