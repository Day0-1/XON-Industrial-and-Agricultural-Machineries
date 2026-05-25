"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  AdminInput,
  adminButtonSecondaryClass,
} from "@/components/admin/AdminFields";

type ProductFeaturesFieldProps = {
  features: string[];
  onChange: (features: string[]) => void;
};

export function ProductFeaturesField({
  features,
  onChange,
}: ProductFeaturesFieldProps) {
  const [draft, setDraft] = useState("");

  function addFeature() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const exists = features.some(
      (f) => f.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      setDraft("");
      return;
    }
    onChange([...features, trimmed]);
    setDraft("");
  }

  function removeFeature(index: number) {
    onChange(features.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">Features</p>
        <p className="mt-1 text-xs text-slate-500">
          Add bullet points shown on the product page under Key features and
          Applications.
        </p>
      </div>

      <div className="flex gap-2">
        <AdminInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Low maintenance operation"
          className="flex-1"
        />
        <button
          type="button"
          onClick={addFeature}
          disabled={!draft.trim()}
          className={`inline-flex shrink-0 items-center gap-2 ${adminButtonSecondaryClass}`}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add
        </button>
      </div>

      {features.length > 0 ? (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li
              key={`${feature}-${index}`}
              className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-800"
            >
              <span className="flex-1">{feature}</span>
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                aria-label={`Remove ${feature}`}
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-xs text-slate-500">
          No features yet. Add items above — they will appear on the product
          preview after you save.
        </p>
      )}
    </div>
  );
}
