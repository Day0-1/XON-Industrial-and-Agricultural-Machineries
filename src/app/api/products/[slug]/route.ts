import { jsonError, jsonOk } from "@/lib/api/http";
import { getProductBySlug } from "@/integrations/mongodb/products";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) {
      return jsonError("Product not found", 404);
    }
    return jsonOk({ product });
  } catch {
    return jsonError("Failed to load product", 500);
  }
}
