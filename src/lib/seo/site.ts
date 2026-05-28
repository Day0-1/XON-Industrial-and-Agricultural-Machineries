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

const DEFAULT_PRODUCTION_SITE_URL = "https://xonindustrialmachineries.com";

export function getTwitterHandle(): string | undefined {
  const handle = process.env.NEXT_PUBLIC_TWITTER_HANDLE?.trim();
  if (!handle) return undefined;
  return handle.startsWith("@") ? handle : `@${handle}`;
}

function normalizeSiteUrl(url: string): string {
  const trimmed = url.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Canonical public site origin (sitemap, WhatsApp product links, JSON-LD, OG).
 *
 * Priority:
 * 1. SITE_URL — runtime on server (cPanel); no rebuild needed
 * 2. NEXT_PUBLIC_SITE_URL — baked at build time if set before `npm run build`
 * 3. https://{APEX_HOST} — when production hosts are configured
 * 4. DEFAULT_PRODUCTION_SITE_URL
 */
export function getSiteUrl(): string {
  const siteUrl = process.env.SITE_URL?.trim();
  if (siteUrl) return normalizeSiteUrl(siteUrl);

  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (publicUrl && !publicUrl.includes("localhost")) {
    return normalizeSiteUrl(publicUrl);
  }

  const apex = process.env.APEX_HOST?.trim();
  if (apex && apex !== "localhost" && !apex.includes("localhost")) {
    return normalizeSiteUrl(apex);
  }

  if (publicUrl) return normalizeSiteUrl(publicUrl);

  return DEFAULT_PRODUCTION_SITE_URL;
}

export function resolveSiteImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
