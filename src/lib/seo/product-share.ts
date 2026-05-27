import type { Product } from "@/types/product";
import { toSocialPreviewImageUrl } from "./social-image";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export function pickProductPreviewImage(
  product: Pick<Product, "images" | "imageUrl">,
): string | undefined {
  for (const img of product.images) {
    const url = img.imageUrl?.trim();
    if (url) return url;
  }
  const legacy = product.imageUrl?.trim();
  return legacy || undefined;
}

export function getProductShareImage(
  product: Pick<Product, "images" | "imageUrl">,
): { url: string; width: number; height: number } | undefined {
  const raw = pickProductPreviewImage(product);
  if (!raw) return undefined;

  return {
    url: toSocialPreviewImageUrl(raw, OG_WIDTH, OG_HEIGHT),
    width: OG_WIDTH,
    height: OG_HEIGHT,
  };
}
