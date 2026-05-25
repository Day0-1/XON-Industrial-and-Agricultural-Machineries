import { jsonError, jsonOk } from "@/lib/api/http";
import { incrementProductClickBySlug } from "@/integrations/mongodb/products";

type Params = { params: Promise<{ slug: string }> };

export async function POST(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    if (!slug?.trim()) return jsonError("Invalid product", 400);

    const recorded = await incrementProductClickBySlug(slug.trim());
    if (!recorded) return jsonError("Product not found", 404);

    return jsonOk({ ok: true });
  } catch {
    return jsonError("Failed to record click", 500);
  }
}
