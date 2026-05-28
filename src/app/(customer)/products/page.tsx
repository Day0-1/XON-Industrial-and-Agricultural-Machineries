import { ProductBreadcrumbs } from "@/components/customer/products/ProductBreadcrumbs";
import { ProductCatalogCard } from "@/components/customer/products/ProductCatalogCard";
import { ProductsCategorySidebar } from "@/components/customer/products/ProductsCategorySidebar";
import { ProductsHelpBox } from "@/components/customer/products/ProductsHelpBox";
import { HotPicksCarousel } from "@/components/customer/home/HotPicksCarousel";
import { FadeIn } from "@/components/customer/FadeIn";
import { ListPagination } from "@/components/shared/ListPagination";
import { ProductSearchBar } from "@/components/shared/ProductSearchBar";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { listActiveCollections } from "@/integrations/mongodb/collections";
import { listActiveHotPicks } from "@/integrations/mongodb/hot-picks";
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
import { customerPageShellClass } from "@/lib/site/customer-layout";
import { getWhatsAppHref } from "@/lib/whatsapp";

type SearchParams = {
  searchParams: Promise<{ category?: string; page?: string; q?: string }>;
};

function isCatalogFilterVariant(params: {
  category?: string;
  page?: string;
  q?: string;
}): boolean {
  if (params.q?.trim()) return true;
  if (params.category?.trim()) return true;
  const page = Number.parseInt(params.page ?? "1", 10);
  return Number.isFinite(page) && page > 1;
}

export async function generateMetadata({ searchParams }: SearchParams) {
  const params = await searchParams;

  return buildPageMetadata({
    title: "Products",
    description: "Browse industrial and agricultural machinery from XON.",
    path: "/products",
    noIndex: isCatalogFilterVariant(params),
  });
}

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
  const hotPicks = await listActiveHotPicks();

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
      <BreadcrumbJsonLd
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
        ]}
      />
      <div className={customerPageShellClass}>
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Our products
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
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

        <div className="mt-8 flex flex-col gap-8 lg:mt-12 lg:grid lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-12">
          <main className="order-1 min-w-0 space-y-6 lg:order-none lg:col-start-2 lg:space-y-8">
            <ProductSearchBar
              defaultQuery={searchQuery ?? ""}
              category={activeCategory}
              clearHref={searchQuery ? clearSearchHref : undefined}
            />

            <FadeIn delay={0.06}>
              <div className="rounded-3xl border border-slate-100 bg-surface/50 p-3 sm:p-4">
                <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-light">
                  Hot picks
                </p>
                <p className="px-2 pt-1 text-sm text-slate-600">
                  Latest machinery highlights and announcements.
                </p>
                <div className="mt-3">
                  <HotPicksCarousel picks={hotPicks} />
                </div>
              </div>
            </FadeIn>

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
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
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

          <FadeIn
            delay={0.08}
            className="order-2 min-w-0 lg:order-none lg:col-start-1 lg:row-start-1 lg:sticky lg:top-28 lg:self-start"
          >
            <aside className="space-y-6 lg:space-y-8">
              <ProductsCategorySidebar
                nav={catalogNav}
                activeCategory={activeCategory}
              />
              <ProductsHelpBox whatsappHref={whatsappHref} />
            </aside>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
