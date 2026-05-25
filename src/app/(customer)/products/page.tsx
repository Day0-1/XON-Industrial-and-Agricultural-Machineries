import { ProductBreadcrumbs } from "@/components/customer/products/ProductBreadcrumbs";
import { ProductCatalogCard } from "@/components/customer/products/ProductCatalogCard";
import { ProductsCategorySidebar } from "@/components/customer/products/ProductsCategorySidebar";
import { ProductsHelpBox } from "@/components/customer/products/ProductsHelpBox";
import { FadeIn } from "@/components/customer/FadeIn";
import { ListPagination } from "@/components/shared/ListPagination";
import { ProductSearchBar } from "@/components/shared/ProductSearchBar";
import { listActiveCollections } from "@/integrations/mongodb/collections";
import { listActiveProductsPaginated } from "@/integrations/mongodb/products";
import {
  buildCatalogNav,
  parseCatalogCategory,
} from "@/lib/site/products";
import {
  buildProductListHref,
  parsePageParam,
  PRODUCTS_PAGE_SIZE,
} from "@/lib/pagination";
import { parseSearchQuery } from "@/lib/search";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const metadata = buildPageMetadata({
  title: "Products",
  description: "Browse industrial and agricultural machinery from XON.",
  path: "/products",
});

type SearchParams = {
  searchParams: Promise<{ category?: string; page?: string; q?: string }>;
};

export default async function ProductsPage({ searchParams }: SearchParams) {
  const { category: categoryParam, page: pageParam, q: qParam } =
    await searchParams;
  const collections = await listActiveCollections();
  const validSlugs = collections.map((col) => col.slug);
  const activeCategory = parseCatalogCategory(categoryParam, validSlugs);
  const page = parsePageParam(pageParam);
  const searchQuery = parseSearchQuery(qParam);

  const catalogResult = await listActiveProductsPaginated(
    page,
    PRODUCTS_PAGE_SIZE,
    activeCategory === "all" ? undefined : activeCategory,
    searchQuery,
  );

  const catalogNav = buildCatalogNav(collections);
  const activeCollection = collections.find((col) => col.slug === activeCategory);

  const whatsappHref = getWhatsAppHref(
    "Hello XON, I need help choosing the right product from your catalog.",
  );

  const paginationHref = (p: number) =>
    buildProductListHref(p, {
      category: activeCategory === "all" ? undefined : activeCategory,
      q: searchQuery,
    });

  const clearSearchHref = buildProductListHref(1, {
    category: activeCategory === "all" ? undefined : activeCategory,
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <FadeIn>
          <ProductBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products" },
            ]}
          />
        </FadeIn>

        <FadeIn delay={0.04}>
          <header className="mt-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Our products
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              High-quality industrial and agricultural equipment for every need.
              Browse the catalog, then inquire on WhatsApp for pricing and
              availability.
            </p>
            {activeCollection && (
              <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-brand-light">
                Showing: {activeCollection.name}
              </p>
            )}
          </header>
        </FadeIn>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-12">
          <FadeIn delay={0.08} className="lg:sticky lg:top-28 lg:self-start">
            <aside>
              <ProductsCategorySidebar
                nav={catalogNav}
                activeCategory={activeCategory}
              />
              <ProductsHelpBox whatsappHref={whatsappHref} />
            </aside>
          </FadeIn>

          <main className="space-y-8">
            <ProductSearchBar
              defaultQuery={searchQuery ?? ""}
              category={activeCategory}
              clearHref={searchQuery ? clearSearchHref : undefined}
            />

            {catalogResult.items.length === 0 ? (
              <FadeIn>
                <div className="rounded-2xl border border-dashed border-slate-200 bg-surface px-8 py-16 text-center">
                  <p className="text-lg font-semibold text-slate-800">
                    {searchQuery
                      ? `No products match “${searchQuery}”`
                      : "No products in this category yet"}
                  </p>
                  <p className="mt-2 text-slate-600">
                    {searchQuery
                      ? "Try different keywords or browse all products in this category."
                      : "Try another category or message us on WhatsApp—we can source equipment for your requirements."}
                  </p>
                </div>
              </FadeIn>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {catalogResult.items.map((product, index) => (
                    <FadeIn key={product._id} delay={0.06 + index * 0.03}>
                      <ProductCatalogCard product={product} />
                    </FadeIn>
                  ))}
                </div>
                <ListPagination
                  page={catalogResult.page}
                  totalPages={catalogResult.totalPages}
                  total={catalogResult.total}
                  pageSize={catalogResult.pageSize}
                  buildHref={paginationHref}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
