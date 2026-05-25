import Link from "next/link";
import { Search, X } from "lucide-react";
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
  return (
    <form
      method="get"
      action={action}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      {category && category !== "all" && (
        <input type="hidden" name="category" value={category} />
      )}
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder={placeholder}
          className={`${adminInputClass} pl-11`}
        />
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="submit"
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Search
        </button>
        {defaultQuery && clearHref && (
          <Link
            href={clearHref}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            <X className="h-4 w-4" aria-hidden />
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
