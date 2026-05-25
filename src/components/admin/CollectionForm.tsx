"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminCheckbox,
  AdminInput,
  AdminTextarea,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
} from "@/components/admin/AdminFields";
import type { Collection } from "@/types/collection";

type CollectionFormProps = {
  collection?: Collection;
  mode?: "create" | "edit";
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CollectionForm({
  collection,
  mode,
  onSuccess,
  onCancel,
}: CollectionFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit" || Boolean(collection);

  const [name, setName] = useState(collection?.name ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [sortOrder, setSortOrder] = useState(
    collection?.sortOrder?.toString() ?? "0",
  );
  const [active, setActive] = useState(collection?.active ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name,
      description,
      sortOrder: Number.parseInt(sortOrder, 10) || 0,
      active,
    };

    try {
      const url = isEdit
        ? `/api/admin/collections/${collection!._id}`
        : "/api/admin/collections";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/collections");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}

      <AdminInput
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Collection name (e.g. Industrial)"
      />

      {isEdit && collection && (
        <p className="px-1 text-xs text-slate-400">
          URL slug: <code className="text-slate-600">{collection.slug}</code>
        </p>
      )}

      <AdminTextarea
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description for this category (optional)"
      />

      <AdminInput
        type="number"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        placeholder="Sort order — lower numbers appear first"
      />

      <AdminCheckbox
        checked={active}
        onChange={setActive}
        label="Visible in customer catalog"
      />

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={saving} className={adminButtonPrimaryClass}>
          {saving ? "Saving…" : isEdit ? "Update collection" : "Create collection"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={adminButtonSecondaryClass}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
