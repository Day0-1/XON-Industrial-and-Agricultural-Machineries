import { jsonError, jsonOk, requireAdmin } from "@/lib/api/http";
import type { CollectionInput } from "@/types/collection";
import {
  countProductsInCollection,
  deleteCollection,
  getCollectionById,
  updateCollection,
} from "@/integrations/mongodb/collections";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const collection = await getCollectionById(id);
    if (!collection) return jsonError("Collection not found", 404);
    return jsonOk({ collection });
  } catch {
    return jsonError("Failed to load collection", 500);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    const input = parseCollectionInput(body, true);
    if (!input) return jsonError("Invalid collection data", 400);

    const collection = await updateCollection(id, input);
    if (!collection) return jsonError("Collection not found", 404);
    return jsonOk({ collection });
  } catch {
    return jsonError("Failed to update collection", 500);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const productCount = await countProductsInCollection(id);
    if (productCount > 0) {
      return jsonError(
        "Cannot delete a collection that still has products. Reassign or delete those products first.",
        409,
      );
    }

    const collection = await deleteCollection(id);
    if (!collection) return jsonError("Collection not found", 404);
    return jsonOk({ collection });
  } catch {
    return jsonError("Failed to delete collection", 500);
  }
}

function parseCollectionInput(
  body: unknown,
  partial = false,
): Partial<CollectionInput> | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const input: Partial<CollectionInput> = {};

  if (typeof data.name === "string") {
    const name = data.name.trim();
    if (!name && !partial) return null;
    if (name) input.name = name;
  } else if (!partial) {
    return null;
  }

  if (typeof data.description === "string") {
    input.description = data.description.trim();
  }

  if (typeof data.sortOrder === "number" && Number.isFinite(data.sortOrder)) {
    input.sortOrder = data.sortOrder;
  }

  if (typeof data.active === "boolean") {
    input.active = data.active;
  }

  return input;
}
