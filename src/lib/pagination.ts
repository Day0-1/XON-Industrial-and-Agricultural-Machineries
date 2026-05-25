export const PRODUCTS_PAGE_SIZE = 20;

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function parsePageParam(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

export function getPaginationRange(
  page: number,
  pageSize: number,
  total: number,
): { from: number; to: number } {
  if (total === 0) return { from: 0, to: 0 };
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return { from, to };
}

export function buildProductListHref(
  page: number,
  options?: { category?: string; q?: string },
): string {
  const params = new URLSearchParams();
  if (options?.category && options.category !== "all") {
    params.set("category", options.category);
  }
  if (options?.q) {
    params.set("q", options.q);
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export function buildAdminProductListHref(
  page: number,
  q?: string,
): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}
