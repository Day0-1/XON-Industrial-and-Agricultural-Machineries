"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  getProductFeatures,
  getProductSpecifications,
  productOrderingNotes,
} from "@/lib/site/products";
import type { Product } from "@/types/product";

const tabs = [
  { id: "description", label: "Description" },
  { id: "specifications", label: "Specifications" },
  { id: "additional", label: "Additional information" },
] as const;

type TabId = (typeof tabs)[number]["id"];

type ProductDetailTabsProps = {
  product: Product;
};

export function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("description");
  const features = getProductFeatures(product);
  const specifications = getProductSpecifications(product);

  return (
    <div>
      <div
        className="flex gap-6 border-b border-slate-200"
        role="tablist"
        aria-label="Product information"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-3 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span
                className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                aria-hidden
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 text-sm leading-relaxed text-slate-600">
        {activeTab === "description" && (
          <div role="tabpanel">
            <p className="text-base leading-8 text-slate-700">
              {product.description}
            </p>
            <h4 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-900">
              Applications
            </h4>
            <ul className="mt-3 space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                    aria-hidden
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "specifications" && (
          <div role="tabpanel">
            <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200">
              {specifications.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr]"
                >
                  <dt className="font-semibold text-slate-900">{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-slate-500">
              Message us on WhatsApp for full technical specifications, datasheets,
              and model-specific details for{" "}
              <span className="font-medium text-slate-700">{product.name}</span>.
            </p>
          </div>
        )}

        {activeTab === "additional" && (
          <div role="tabpanel">
            <p className="text-base text-slate-700">
              Category:{" "}
              <span className="font-semibold text-slate-900">
                {product.collectionName}
              </span>
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {productOrderingNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
