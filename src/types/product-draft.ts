export type RemoteProductImage = {
  kind: "remote";
  imageUrl: string;
  cloudinaryPublicId: string;
};

export type LocalProductImage = {
  kind: "local";
  id: string;
  file: File;
  previewUrl: string;
};

export type DraftProductImage = RemoteProductImage | LocalProductImage;

export function remoteToDraft(image: {
  imageUrl: string;
  cloudinaryPublicId: string;
}): RemoteProductImage {
  return {
    kind: "remote",
    imageUrl: image.imageUrl,
    cloudinaryPublicId: image.cloudinaryPublicId,
  };
}

export async function uploadLocalProductImage(
  file: File,
): Promise<{ imageUrl: string; cloudinaryPublicId: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  return {
    imageUrl: data.imageUrl,
    cloudinaryPublicId: data.cloudinaryPublicId,
  };
}

export async function resolveDraftImages(
  drafts: DraftProductImage[],
): Promise<{ imageUrl: string; cloudinaryPublicId: string }[]> {
  const resolved: { imageUrl: string; cloudinaryPublicId: string }[] = [];

  for (const draft of drafts) {
    if (draft.kind === "remote") {
      resolved.push({
        imageUrl: draft.imageUrl,
        cloudinaryPublicId: draft.cloudinaryPublicId,
      });
      continue;
    }
    const uploaded = await uploadLocalProductImage(draft.file);
    resolved.push(uploaded);
  }

  return resolved;
}

export function revokeDraftPreview(draft: DraftProductImage): void {
  if (draft.kind === "local") {
    URL.revokeObjectURL(draft.previewUrl);
  }
}

export function revokeAllDraftPreviews(drafts: DraftProductImage[]): void {
  for (const draft of drafts) {
    revokeDraftPreview(draft);
  }
}

function localId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `local-${crypto.randomUUID()}`;
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function filesToLocalDrafts(files: File[]): LocalProductImage[] {
  return files
    .filter((f) => f.type.startsWith("image/"))
    .map((file) => ({
      kind: "local" as const,
      id: localId(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
}

export function productToDraftImages(product?: {
  images?: { imageUrl: string; cloudinaryPublicId: string }[];
  imageUrl?: string;
  cloudinaryPublicId?: string;
}): DraftProductImage[] {
  const source =
    product?.images && product.images.length > 0
      ? product.images
      : product?.imageUrl && product.cloudinaryPublicId
        ? [
            {
              imageUrl: product.imageUrl,
              cloudinaryPublicId: product.cloudinaryPublicId,
            },
          ]
        : [];

  return source.map(remoteToDraft);
}
