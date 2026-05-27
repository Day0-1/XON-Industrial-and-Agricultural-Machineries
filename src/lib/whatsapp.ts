import { getSiteUrl } from "@/lib/seo/site";

function resolveWhatsAppNumber(): string | undefined {
  const raw =
    process.env.WHATSAPP_NUMBER ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const number = raw?.replace(/\D/g, "");
  return number && number.length > 0 ? number : undefined;
}

export function getWhatsAppNumber(): string {
  const number = resolveWhatsAppNumber();
  if (!number) {
    throw new Error("WHATSAPP_NUMBER is not configured.");
  }
  return number;
}

export function hasWhatsAppConfigured(): boolean {
  return resolveWhatsAppNumber() !== undefined;
}

export function getWhatsAppNumberIfConfigured(): string | null {
  return resolveWhatsAppNumber() ?? null;
}

export function buildWhatsAppUrl(message: string): string {
  const number = getWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppHref(message: string): string | null {
  const number = resolveWhatsAppNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildProductPageUrl(slug: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  return `${base}/products/${slug}`;
}

export function buildProductInquiryMessage(
  productName: string,
  productSlug: string,
): string {
  const url = buildProductPageUrl(productSlug);
  return [
    "Hello XON, I would like to inquire about:",
    productName,
    "",
    url,
  ].join("\n");
}

export function buildProductQuoteMessage(
  productName: string,
  quantity: number,
  productSlug: string,
): string {
  const url = buildProductPageUrl(productSlug);
  return [
    `Hello XON, I would like a quote for: ${productName} (quantity: ${quantity})`,
    "",
    url,
  ].join("\n");
}

/** Sidebar / help CTA on a product page */
export function buildProductPurchaseMessage(
  productName: string,
  productSlug: string,
): string {
  const url = buildProductPageUrl(productSlug);
  return [
    "Hello XON, I would like to purchase:",
    productName,
    "",
    url,
  ].join("\n");
}
