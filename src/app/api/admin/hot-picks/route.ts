import { jsonError, jsonOk, requireAdmin } from "@/lib/api/http";
import { parseHotPickInput } from "@/lib/hot-picks";
import type { HotPickInput } from "@/types/hot-pick";
import {
  createHotPick,
  ensureHotPickIndexes,
  listAllHotPicks,
} from "@/integrations/mongodb/hot-picks";

let indexesReady = false;

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    if (!indexesReady) {
      await ensureHotPickIndexes();
      indexesReady = true;
    }
    const hotPicks = await listAllHotPicks();
    return jsonOk({ hotPicks });
  } catch {
    return jsonError("Failed to load hot picks", 500);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const input = parseHotPickInput(body);
    if (!input) return jsonError("Invalid hot pick data", 400);

    const hotPick = await createHotPick(input as HotPickInput);
    return jsonOk({ hotPick }, 201);
  } catch {
    return jsonError("Failed to create hot pick", 500);
  }
}
