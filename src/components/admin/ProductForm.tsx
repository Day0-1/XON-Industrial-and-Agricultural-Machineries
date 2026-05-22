"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product, ProductCategory } from "@/types/product";

type ProductFormProps = {
  product?: Product;
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? "industrial",
  );
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [active, setActive] = useState(product?.active ?? true);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState(
    product?.cloudinaryPublicId ?? "",
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleImageChange(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImageUrl(data.imageUrl);
      setCloudinaryPublicId(data.cloudinaryPublicId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name,
      description,
      category,
      imageUrl,
      cloudinaryPublicId,
      featured,
      active,
    };

    try {
      const url = isEdit
        ? `/api/admin/products/${product!._id}`
        : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="industrial">Industrial</option>
          <option value="agricultural">Agricultural</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
          className="block w-full text-sm"
        />
        {uploading && <p className="mt-1 text-sm text-zinc-500">Uploading…</p>}
        {imageUrl && (
          <div className="relative mt-3 h-40 w-full max-w-xs">
            <Image
              src={imageUrl}
              alt="Preview"
              fill
              className="rounded-md object-cover"
            />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Featured on homepage
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Visible on website
      </label>

      <button
        type="submit"
        disabled={saving || uploading || !imageUrl || !cloudinaryPublicId}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
      >
        {saving ? "Saving…" : isEdit ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
