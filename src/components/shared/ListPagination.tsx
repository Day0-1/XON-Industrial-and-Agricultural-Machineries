import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginationRange } from "@/lib/pagination";

type ListPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  buildHref: (page: number) => string;
};

function pageNumbers(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export function ListPagination({
  page,
  totalPages,
  total,
  pageSize,
  buildHref,
}: ListPaginationProps) {
  if (totalPages <= 1) return null;

  const { from, to } = getPaginationRange(page, pageSize, total);
  const pages = pageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-4 rounded-[24px] bg-slate-100/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
    >
      <p className="text-center text-sm text-slate-600 sm:text-left">
        Showing <span className="font-semibold text-slate-900">{from}</span>
        {"–"}
        <span className="font-semibold text-slate-900">{to}</span> of{" "}
        <span className="font-semibold text-slate-900">{total}</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {page > 1 ? (
          <Link
            href={buildHref(page - 1)}
            className="inline-flex items-center gap-1 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Prev
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-2xl bg-white/50 px-3 py-2 text-sm font-medium text-slate-400">
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Prev
          </span>
        )}

        {pages.map((pageNum, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && pageNum - prev > 1;

          return (
            <span key={pageNum} className="flex items-center gap-1.5">
              {showEllipsis && (
                <span className="px-1 text-sm text-slate-400" aria-hidden>
                  …
                </span>
              )}
              {pageNum === page ? (
                <span
                  aria-current="page"
                  className="inline-flex min-w-[2.25rem] items-center justify-center rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/15"
                >
                  {pageNum}
                </span>
              ) : (
                <Link
                  href={buildHref(pageNum)}
                  className="inline-flex min-w-[2.25rem] items-center justify-center rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  {pageNum}
                </Link>
              )}
            </span>
          );
        })}

        {page < totalPages ? (
          <Link
            href={buildHref(page + 1)}
            className="inline-flex items-center gap-1 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Next page"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-2xl bg-white/50 px-3 py-2 text-sm font-medium text-slate-400">
            Next
            <ChevronRight className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
    </nav>
  );
}
