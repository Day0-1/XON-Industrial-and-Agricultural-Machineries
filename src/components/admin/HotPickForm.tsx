"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  AdminCheckbox,
  AdminInput,
  AdminTextarea,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
} from "@/components/admin/AdminFields";
import type { HotPick } from "@/types/hot-pick";

type HotPickFormProps = {
  hotPick?: HotPick;
  mode?: "create" | "edit";
};

async function uploadBanner(file: File) {
  const form = new FormData();
  form.append("file", file);
  form.append("purpose", "hot-pick");
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  return {
    imageUrl: data.imageUrl as string,
    cloudinaryPublicId: data.cloudinaryPublicId as string,
  };
}

export function HotPickForm({ hotPick, mode }: HotPickFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = mode === "edit" || Boolean(hotPick);

  const [title, setTitle] = useState(hotPick?.title ?? "");
  const [description, setDescription] = useState(hotPick?.description ?? "");
  const [linkUrl, setLinkUrl] = useState(hotPick?.linkUrl ?? "");
  const [sortOrder, setSortOrder] = useState(
    hotPick?.sortOrder?.toString() ?? "0",
  );
  const [active, setActive] = useState(hotPick?.active ?? true);
  const [imageUrl, setImageUrl] = useState(hotPick?.imageUrl ?? "");
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState(
    hotPick?.cloudinaryPublicId ?? "",
  );
  const [previewUrl, setPreviewUrl] = useState(hotPick?.imageUrl ?? "");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function onFileChange(file: File | null) {
    if (!file) return;
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let finalImageUrl = imageUrl;
      let finalPublicId = cloudinaryPublicId;

      if (pendingFile) {
        const uploaded = await uploadBanner(pendingFile);
        finalImageUrl = uploaded.imageUrl;
        finalPublicId = uploaded.cloudinaryPublicId;
        setImageUrl(uploaded.imageUrl);
        setCloudinaryPublicId(uploaded.cloudinaryPublicId);
      }

      if (!finalImageUrl || !finalPublicId) {
        throw new Error("Banner image is required.");
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        linkUrl: linkUrl.trim() || null,
        sortOrder: Number.parseInt(sortOrder, 10) || 0,
        active,
        imageUrl: finalImageUrl,
        cloudinaryPublicId: finalPublicId,
      };

      const url = isEdit
        ? `/api/admin/hot-picks/${hotPick!._id}`
        : "/api/admin/hot-picks";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      router.push("/hot-picks");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold text-slate-900">Banner image</p>
        <p className="mt-1 text-xs text-slate-500">
          Rectangular image — shown on the home page carousel.
        </p>

        {previewUrl && (
          <div className="relative mt-4 aspect-[16/10] max-h-56 w-full overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={previewUrl}
              alt="Banner preview"
              fill
              className="object-cover"
              unoptimized={previewUrl.startsWith("blob:")}
            />
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
      </div>

      <div>
        <p className="mb-2 block text-sm font-medium text-slate-700">Title</p>
        <AdminInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Crane"
        />
      </div>
      <div>
        <p className="mb-2 block text-sm font-medium text-slate-700">
          Short description
        </p>
        <AdminTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. One of our latest products"
          rows={3}
        />
      </div>
      <div>
        <p className="mb-2 block text-sm font-medium text-slate-700">
          Link (optional)
        </p>
        <AdminInput
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="/products/some-slug or https://…"
        />
      </div>
      <p className="-mt-2 text-xs text-slate-500">
        When set, the whole banner links to this URL or product page.
      </p>
      <div>
        <p className="mb-2 block text-sm font-medium text-slate-700">Sort order</p>
        <AdminInput
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </div>
      <AdminCheckbox
        checked={active}
        onChange={setActive}
        label="Visible on homepage"
      />

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={saving} className={adminButtonPrimaryClass}>
          {saving ? "Saving…" : isEdit ? "Update banner" : "Add banner"}
        </button>
        <button
          type="button"
          className={adminButtonSecondaryClass}
          onClick={() => router.push("/hot-picks")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
