import { jsonError, jsonOk } from "@/lib/api/http";
import { isMongoConfigured } from "@/integrations/mongodb/client";
import { ensureProductIndexes, listActiveProducts } from "@/integrations/mongodb/products";

let indexesReady = false;

export async function GET() {
  if (!isMongoConfigured()) {
    return jsonOk({ products: [] });
  }

  try {
    if (!indexesReady) {
      await ensureProductIndexes();
      indexesReady = true;
    }
    const products = await listActiveProducts();
    return jsonOk({ products });
  } catch {
    return jsonError("Failed to load products", 500);
  }
}
