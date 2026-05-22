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

export function buildProductInquiryMessage(productName: string): string {
  return `Hello XON, I would like to inquire about: ${productName}`;
}

export function buildProductQuoteMessage(
  productName: string,
  quantity: number,
): string {
  return `Hello XON, I would like a quote for: ${productName} (quantity: ${quantity})`;
}
