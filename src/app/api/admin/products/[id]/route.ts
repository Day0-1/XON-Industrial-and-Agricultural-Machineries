import { jsonError, jsonOk, requireAdmin } from "@/lib/api/http";
import type { ProductCategory, ProductInput } from "@/types/product";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/integrations/mongodb/products";
import { deleteCloudinaryImage } from "@/integrations/cloudinary/upload";

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
    const input = parsePartialProductInput(body);
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

    if (product.cloudinaryPublicId) {
      try {
        await deleteCloudinaryImage(product.cloudinaryPublicId);
      } catch {
        // Product removed from DB even if Cloudinary delete fails
      }
    }

    return jsonOk({ product });
  } catch {
    return jsonError("Failed to delete product", 500);
  }
}

function parsePartialProductInput(
  body: unknown,
): Partial<ProductInput> | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const input: Partial<ProductInput> = {};

  if (typeof data.name === "string") input.name = data.name.trim();
  if (typeof data.description === "string") {
    input.description = data.description.trim();
  }
  if (data.category === "industrial" || data.category === "agricultural") {
    input.category = data.category;
  }
  if (typeof data.imageUrl === "string") input.imageUrl = data.imageUrl;
  if (typeof data.cloudinaryPublicId === "string") {
    input.cloudinaryPublicId = data.cloudinaryPublicId;
  }
  if (typeof data.featured === "boolean") input.featured = data.featured;
  if (typeof data.active === "boolean") input.active = data.active;

  return Object.keys(input).length > 0 ? input : null;
}
