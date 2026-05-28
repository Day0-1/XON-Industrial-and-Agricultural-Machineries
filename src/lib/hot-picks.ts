import type { HotPickInput } from "@/types/hot-pick";

export function normalizeHotPickLink(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return null;
}

export function parseHotPickInput(
  body: unknown,
  partial = false,
): HotPickInput | Partial<HotPickInput> | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const input: Partial<HotPickInput> = {};

  if (typeof data.title === "string") {
    const title = data.title.trim();
    if (!title && !partial) return null;
    if (title) input.title = title;
  } else if (!partial) {
    return null;
  }

  if (typeof data.description === "string") {
    input.description = data.description.trim();
  }

  if (typeof data.imageUrl === "string" && data.imageUrl.trim()) {
    input.imageUrl = data.imageUrl.trim();
  } else if (!partial) {
    return null;
  }

  if (
    typeof data.cloudinaryPublicId === "string" &&
    data.cloudinaryPublicId.trim()
  ) {
    input.cloudinaryPublicId = data.cloudinaryPublicId.trim();
  } else if (!partial) {
    return null;
  }

  if (data.linkUrl === null || data.linkUrl === undefined) {
    if (partial) input.linkUrl = null;
  } else if (typeof data.linkUrl === "string") {
    input.linkUrl = normalizeHotPickLink(data.linkUrl);
  }

  if (typeof data.active === "boolean") {
    input.active = data.active;
  }

  if (typeof data.sortOrder === "number" && Number.isFinite(data.sortOrder)) {
    input.sortOrder = data.sortOrder;
  }

  if (!partial && (!input.title || !input.imageUrl || !input.cloudinaryPublicId)) {
    return null;
  }

  return input as HotPickInput;
}
