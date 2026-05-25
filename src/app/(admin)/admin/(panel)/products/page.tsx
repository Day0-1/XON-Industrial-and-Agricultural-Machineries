import Image from "next/image";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ListPagination } from "@/components/shared/ListPagination";
import { ProductSearchBar } from "@/components/shared/ProductSearchBar";
import { listAllProductsPaginated } from "@/integrations/mongodb/products";
import { formatClickCount, formatClickCountFull } from "@/lib/admin/format";
import {
  buildAdminProductListHref,
  parsePageParam,
  PRODUCTS_PAGE_SIZE,
} from "@/lib/pagination";
import { parseSearchQuery } from "@/lib/search";

type SearchParams = { searchParams: Promise<{ page?: string; q?: string }> };

export default async function AdminProductsPage({ searchParams }: SearchParams) {
  const { page: pageParam, q: qParam } = await searchParams;
  const page = parsePageParam(pageParam);
  const searchQuery = parseSearchQuery(qParam);
  const result = await listAllProductsPaginated(
    page,
    PRODUCTS_PAGE_SIZE,
    searchQuery,
  );

  const clearSearchHref = buildAdminProductListHref(1);
  const paginationHref = (p: number) => buildAdminProductListHref(p, searchQuery);

  const description =
    searchQuery && result.total > 0
      ? `${result.total} match${result.total === 1 ? "" : "es"} for “${searchQuery}”`
      : result.total > 0
        ? `${result.total} product${result.total === 1 ? "" : "s"} · sorted by clicks`
        : "Manage catalog items and view customer click counts";

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={description}
        actionHref="/products/new"
        actionLabel="Add product"
      />

      <div className="rounded-[28px] bg-white p-5 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)] sm:p-6">
        <ProductSearchBar
          defaultQuery={searchQuery ?? ""}
          clearHref={searchQuery ? clearSearchHref : undefined}
        />
      </div>

      {result.total === 0 ? (
        <div className="rounded-[28px] bg-white p-10 text-center shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
          <p className="text-slate-500">
            {searchQuery
              ? `No products match “${searchQuery}”.`
              : "No products yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Collection</th>
                    <th className="px-6 py-4">Clicks</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {result.items.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <span className="font-semibold text-slate-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {product.collectionName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">
                          {formatClickCount(product.clickCount)}
                        </span>
                        <span className="ml-1 text-xs text-slate-400">
                          ({formatClickCountFull(product.clickCount)})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {product.active ? "Live" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/products/${product._id}/edit`}
                            className="font-semibold text-slate-900 hover:underline"
                          >
                            Edit
                          </Link>
                          <DeleteProductButton productId={product._id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ListPagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            pageSize={result.pageSize}
            buildHref={paginationHref}
          />
        </div>
      )}
    </>
  );
}
