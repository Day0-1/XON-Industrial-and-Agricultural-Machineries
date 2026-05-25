import type { ProductImage } from "@/types/product";

export function parseProductImages(
  data: Record<string, unknown>,
): ProductImage[] | null {
  if (!Array.isArray(data.images)) return null;

  const images: ProductImage[] = [];
  for (const item of data.images) {
    if (!item || typeof item !== "object") return null;
    const row = item as Record<string, unknown>;
    if (
      typeof row.imageUrl !== "string" ||
      typeof row.cloudinaryPublicId !== "string"
    ) {
      return null;
    }
    images.push({
      imageUrl: row.imageUrl,
      cloudinaryPublicId: row.cloudinaryPublicId,
    });
  }

  return images.length > 0 ? images : null;
}

export function parseProductImagesWithLegacy(
  data: Record<string, unknown>,
): ProductImage[] | null {
  const images = parseProductImages(data);
  if (images) return images;

  const imageUrl = typeof data.imageUrl === "string" ? data.imageUrl : "";
  const cloudinaryPublicId =
    typeof data.cloudinaryPublicId === "string" ? data.cloudinaryPublicId : "";
  if (imageUrl && cloudinaryPublicId) {
    return [{ imageUrl, cloudinaryPublicId }];
  }

  return null;
}
