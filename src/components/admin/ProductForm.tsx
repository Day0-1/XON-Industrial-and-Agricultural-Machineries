"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AdminCheckbox,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  adminButtonPrimaryClass,
} from "@/components/admin/AdminFields";
import { CreateCollectionModal } from "@/components/admin/CreateCollectionModal";
import { ProductFeaturesField } from "@/components/admin/ProductFeaturesField";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import type { Collection } from "@/types/collection";
import type { Product } from "@/types/product";
import {
  productToDraftImages,
  resolveDraftImages,
  revokeAllDraftPreviews,
  type DraftProductImage,
} from "@/types/product-draft";

type ProductFormProps = {
  product?: Product;
  collections: Collection[];
};

export function ProductForm({ product, collections }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);

  const [draftImages, setDraftImages] = useState<DraftProductImage[]>(() =>
    productToDraftImages(product),
  );
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [collectionId, setCollectionId] = useState(
    product?.collectionId ?? collections[0]?._id ?? "",
  );
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [active, setActive] = useState(product?.active ?? true);
  const [clickCount, setClickCount] = useState(
    product?.clickCount?.toString() ?? "0",
  );
  const [features, setFeatures] = useState<string[]>(product?.features ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!collectionId && collections[0]) {
      setCollectionId(collections[0]._id);
    }
  }, [collectionId, collections]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setUploading(true);
    setError("");

    try {
      const images = await resolveDraftImages(draftImages);
      if (images.length === 0) {
        throw new Error("Add at least one product image.");
      }

      setUploading(false);

      const payload: Record<string, unknown> = {
        name,
        description,
        collectionId,
        images,
        features,
        featured,
        active,
      };
      if (isEdit) {
        const parsed = Number.parseInt(clickCount.replace(/,/g, ""), 10);
        payload.clickCount = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
      }

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

      revokeAllDraftPreviews(draftImages);
      router.push("/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setUploading(false);
      setSaving(false);
    }
  }

  const submitLabel = uploading
    ? "Uploading images…"
    : saving
      ? "Saving product…"
      : isEdit
        ? "Update product"
        : "Create product";

  if (collections.length === 0) {
    return (
      <>
        <p className="text-sm text-slate-600">
          Create a collection before adding products.
        </p>
        <button
          type="button"
          onClick={() => setCollectionModalOpen(true)}
          className={`mt-4 ${adminButtonPrimaryClass}`}
        >
          Add collection
        </button>
        <CreateCollectionModal
          open={collectionModalOpen}
          onClose={() => {
            setCollectionModalOpen(false);
            router.refresh();
          }}
        />
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
        )}

        <ImageDropzone items={draftImages} onChange={setDraftImages} />

        <AdminInput
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
        />

        <AdminTextarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Full product description — specs, use cases, and key details"
        />

        <ProductFeaturesField features={features} onChange={setFeatures} />

        <AdminSelect
          required
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
        >
          <option value="" disabled>
            Select collection
          </option>
          {collections.map((col) => (
            <option key={col._id} value={col._id}>
              {col.name}
            </option>
          ))}
        </AdminSelect>

        <AdminCheckbox
          checked={featured}
          onChange={setFeatured}
          label="Featured on homepage"
        />

        <AdminCheckbox
          checked={active}
          onChange={setActive}
          label="Visible on website"
        />

        {isEdit && (
          <AdminInput
            type="text"
            inputMode="numeric"
            value={clickCount}
            onChange={(e) => setClickCount(e.target.value)}
            placeholder="Click count — auto-tracked from product page views"
          />
        )}

        <button
          type="submit"
          disabled={saving || draftImages.length === 0 || !collectionId}
          className={adminButtonPrimaryClass}
        >
          {submitLabel}
        </button>
      </form>

      <CreateCollectionModal
        open={collectionModalOpen}
        onClose={() => {
          setCollectionModalOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
