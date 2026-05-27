"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { CatalogNavItem } from "@/lib/site/products";

type ProductsCategorySidebarProps = {
  nav: CatalogNavItem[];
  activeCategory: string;
};

function CategoryList({
  nav,
  activeCategory,
  onNavigate,
}: {
  nav: CatalogNavItem[];
  activeCategory: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-0.5">
      {nav.map((category) => {
        const isActive = category.id === activeCategory;

        return (
          <li key={category.id}>
            <Link
              href={category.href}
              onClick={onNavigate}
              className={`block border-l-[3px] py-2.5 pl-4 text-sm font-medium transition-colors ${
                isActive
                  ? "border-accent bg-accent/10 text-slate-900"
                  : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {category.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ProductsCategorySidebar({
  nav,
  activeCategory,
}: ProductsCategorySidebarProps) {
  const [open, setOpen] = useState(false);
  const activeLabel =
    nav.find((item) => item.id === activeCategory)?.label ?? "All Products";

  return (
    <div>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
          aria-expanded={open}
          aria-controls="product-categories-panel"
        >
          <span>
            <span className="block text-xs font-bold uppercase tracking-widest text-slate-500">
              Category
            </span>
            <span className="mt-0.5 block">{activeLabel}</span>
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {open && (
          <div
            id="product-categories-panel"
            className="mt-3 rounded-2xl border border-slate-200 bg-white p-2"
          >
            <CategoryList
              nav={nav}
              activeCategory={activeCategory}
              onNavigate={() => setOpen(false)}
            />
          </div>
        )}
      </div>

      <div className="hidden lg:block">
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-900">
          Categories
        </h2>
        <div className="mt-4">
          <CategoryList nav={nav} activeCategory={activeCategory} />
        </div>
      </div>
    </div>
  );
}
