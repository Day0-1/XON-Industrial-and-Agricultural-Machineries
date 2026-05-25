import { jsonError, jsonOk, requireAdmin } from "@/lib/api/http";
import type { ProductInput } from "@/types/product";
import { getCollectionById } from "@/integrations/mongodb/collections";
import {
  createProduct,
  listAllProducts,
} from "@/integrations/mongodb/products";
import { normalizeProductFeatures } from "@/lib/product-features";
import { parseProductImagesWithLegacy } from "@/lib/product-images";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const products = await listAllProducts();
    return jsonOk({ products });
  } catch {
    return jsonError("Failed to load products", 500);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const input = await parseProductInput(body);
    if (!input) return jsonError("Invalid product data", 400);

    const product = await createProduct(input);
    return jsonOk({ product }, 201);
  } catch {
    return jsonError("Failed to create product", 500);
  }
}

async function parseProductInput(body: unknown): Promise<ProductInput | null> {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const collectionId =
    typeof data.collectionId === "string" ? data.collectionId.trim() : "";

  const images = parseProductImagesWithLegacy(data);
  if (!images) {
    return null;
  }

  if (!name || !description || !collectionId) {
    return null;
  }

  const col = await getCollectionById(collectionId);
  if (!col) return null;

  return {
    name,
    description,
    collectionId,
    images,
    featured: Boolean(data.featured),
    active: data.active !== false,
    features: normalizeProductFeatures(data.features),
  };
}
