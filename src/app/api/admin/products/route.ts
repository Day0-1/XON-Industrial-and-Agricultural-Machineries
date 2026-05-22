import { jsonError, jsonOk, requireAdmin } from "@/lib/api/http";
import type { ProductCategory, ProductInput } from "@/types/product";
import {
  createProduct,
  listAllProducts,
} from "@/integrations/mongodb/products";

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
    const input = parseProductInput(body);
    if (!input) return jsonError("Invalid product data", 400);

    const product = await createProduct(input);
    return jsonOk({ product }, 201);
  } catch {
    return jsonError("Failed to create product", 500);
  }
}

function parseProductInput(body: unknown): ProductInput | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const category = data.category as ProductCategory;
  const imageUrl = typeof data.imageUrl === "string" ? data.imageUrl : "";
  const cloudinaryPublicId =
    typeof data.cloudinaryPublicId === "string" ? data.cloudinaryPublicId : "";

  if (!name || !description || !imageUrl || !cloudinaryPublicId) return null;
  if (category !== "industrial" && category !== "agricultural") return null;

  return {
    name,
    description,
    category,
    imageUrl,
    cloudinaryPublicId,
    featured: Boolean(data.featured),
    active: data.active !== false,
  };
}
