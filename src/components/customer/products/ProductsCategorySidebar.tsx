import Link from "next/link";
import type { CatalogNavItem } from "@/lib/site/products";

type ProductsCategorySidebarProps = {
  nav: CatalogNavItem[];
  activeCategory: string;
};

export function ProductsCategorySidebar({
  nav,
  activeCategory,
}: ProductsCategorySidebarProps) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-900">
        Categories
      </h2>
      <ul className="mt-4 space-y-0.5">
        {nav.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <li key={category.id}>
              <Link
                href={category.href}
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
    </div>
  );
}
