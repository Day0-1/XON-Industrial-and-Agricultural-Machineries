 "use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { adminInputClass } from "@/components/admin/AdminFields";

type ProductSearchBarProps = {
  action?: string;
  defaultQuery?: string;
  category?: string;
  placeholder?: string;
  clearHref?: string;
};

export function ProductSearchBar({
  action = "/products",
  defaultQuery = "",
  category,
  placeholder = "Search products by name or description…",
  clearHref,
}: ProductSearchBarProps) {
  const [open, setOpen] = useState(Boolean(defaultQuery));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <form
      method="get"
      action={action}
      className="flex items-center justify-end gap-2"
    >
      {category && category !== "all" && (
        <input type="hidden" name="category" value={category} />
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-brand"
          aria-label="Open product search"
        >
          <Search className="h-5 w-5" aria-hidden />
        </button>
      ) : (
        <>
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              ref={inputRef}
              type="search"
              name="q"
              defaultValue={defaultQuery}
              placeholder={placeholder}
              className={`${adminInputClass} h-11 rounded-full pl-11 pr-12`}
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800"
              aria-label="Search products"
            >
              <Search className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <Link
            href={clearHref ?? action}
            onClick={(e) => {
              if (!defaultQuery && !clearHref) {
                e.preventDefault();
                setOpen(false);
              }
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            aria-label={defaultQuery ? "Clear search" : "Close search"}
          >
            <X className="h-4 w-4" aria-hidden />
          </Link>
        </>
      )}
    </form>
  );
}
