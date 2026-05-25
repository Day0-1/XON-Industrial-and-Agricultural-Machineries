import { jsonError, jsonOk, requireAdmin } from "@/lib/api/http";
import type { ProductInput } from "@/types/product";
import { getCollectionById } from "@/integrations/mongodb/collections";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/integrations/mongodb/products";
import { deleteCloudinaryImage } from "@/integrations/cloudinary/upload";
import { normalizeProductFeatures } from "@/lib/product-features";
import { parseProductImages } from "@/lib/product-images";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return jsonError("Product not found", 404);
    return jsonOk({ product });
  } catch {
    return jsonError("Failed to load product", 500);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    const input = await parsePartialProductInput(body);
    if (!input) return jsonError("Invalid product data", 400);

    const product = await updateProduct(id, input);
    if (!product) return jsonError("Product not found", 404);
    return jsonOk({ product });
  } catch {
    return jsonError("Failed to update product", 500);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const product = await deleteProduct(id);
    if (!product) return jsonError("Product not found", 404);

    const publicIds = new Set(
      product.images.map((img) => img.cloudinaryPublicId),
    );
    for (const publicId of publicIds) {
      try {
        await deleteCloudinaryImage(publicId);
      } catch {
        // Product removed from DB even if Cloudinary delete fails
      }
    }

    return jsonOk({ product });
  } catch {
    return jsonError("Failed to delete product", 500);
  }
}

async function parsePartialProductInput(
  body: unknown,
): Promise<Partial<ProductInput> | null> {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const input: Partial<ProductInput> = {};

  if (typeof data.name === "string") input.name = data.name.trim();
  if (typeof data.description === "string") {
    input.description = data.description.trim();
  }
  if (typeof data.collectionId === "string") {
    const collectionId = data.collectionId.trim();
    const col = await getCollectionById(collectionId);
    if (!col) return null;
    input.collectionId = collectionId;
  }
  if (Array.isArray(data.images)) {
    const images = parseProductImages(data);
    if (!images) return null;
    input.images = images;
  }
  if (typeof data.featured === "boolean") input.featured = data.featured;
  if (typeof data.active === "boolean") input.active = data.active;
  if (typeof data.clickCount === "number" && Number.isFinite(data.clickCount)) {
    input.clickCount = Math.max(0, Math.floor(data.clickCount));
  }
  if (data.features !== undefined) {
    input.features = normalizeProductFeatures(data.features);
  }

  return Object.keys(input).length > 0 ? input : null;
}
