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
  locale: "en",
  twitterHandle: undefined as string | undefined,
};

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return url && url.length > 0 ? url.replace(/\/$/, "") : "http://localhost:3000";
}
