import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type ProductBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function ProductBreadcrumbs({ items }: ProductBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-slate-300"
                  aria-hidden
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="font-medium transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "font-medium text-slate-800"
                      : "font-medium text-slate-500"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
