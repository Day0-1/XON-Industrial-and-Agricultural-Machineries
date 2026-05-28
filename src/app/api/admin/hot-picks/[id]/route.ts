import { jsonError, jsonOk, requireAdmin } from "@/lib/api/http";
import { parseHotPickInput } from "@/lib/hot-picks";
import type { HotPickInput } from "@/types/hot-pick";
import {
  deleteHotPick,
  getHotPickById,
  updateHotPick,
} from "@/integrations/mongodb/hot-picks";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const hotPick = await getHotPickById(id);
    if (!hotPick) return jsonError("Hot pick not found", 404);
    return jsonOk({ hotPick });
  } catch {
    return jsonError("Failed to load hot pick", 500);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    const input = parseHotPickInput(body, true);
    if (!input) return jsonError("Invalid hot pick data", 400);

    const hotPick = await updateHotPick(id, input);
    if (!hotPick) return jsonError("Hot pick not found", 404);
    return jsonOk({ hotPick });
  } catch {
    return jsonError("Failed to update hot pick", 500);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const hotPick = await deleteHotPick(id);
    if (!hotPick) return jsonError("Hot pick not found", 404);
    return jsonOk({ hotPick });
  } catch {
    return jsonError("Failed to delete hot pick", 500);
  }
}
