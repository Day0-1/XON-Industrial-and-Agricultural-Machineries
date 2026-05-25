"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { CollectionForm } from "@/components/admin/CollectionForm";

type CreateCollectionModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateCollectionModal({ open, onClose }: CreateCollectionModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-collection-title"
        className="relative z-10 w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="create-collection-title" className="text-xl font-bold text-slate-900">
              New collection
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add a catalog category for grouping products
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <CollectionForm mode="create" onSuccess={onClose} onCancel={onClose} />
      </div>
    </div>
  );
}
