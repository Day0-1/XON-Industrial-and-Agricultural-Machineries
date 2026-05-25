import { jsonError, jsonOk, requireAdmin } from "@/lib/api/http";
import type { CollectionInput } from "@/types/collection";
import {
  createCollection,
  ensureCollectionIndexes,
  listAllCollections,
} from "@/integrations/mongodb/collections";

let indexesReady = false;

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    if (!indexesReady) {
      await ensureCollectionIndexes();
      indexesReady = true;
    }
    const collections = await listAllCollections();
    return jsonOk({ collections });
  } catch {
    return jsonError("Failed to load collections", 500);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const input = parseCollectionInput(body);
    if (!input) return jsonError("Invalid collection data", 400);

    const collection = await createCollection(input);
    return jsonOk({ collection }, 201);
  } catch {
    return jsonError("Failed to create collection", 500);
  }
}

function parseCollectionInput(body: unknown): CollectionInput | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  if (!name) return null;

  const description =
    typeof data.description === "string" ? data.description.trim() : "";

  const sortOrder =
    typeof data.sortOrder === "number" && Number.isFinite(data.sortOrder)
      ? data.sortOrder
      : 0;

  return {
    name,
    description,
    active: data.active !== false,
    sortOrder,
  };
}
