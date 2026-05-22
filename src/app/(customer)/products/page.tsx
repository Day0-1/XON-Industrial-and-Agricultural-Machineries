import { ProductBreadcrumbs } from "@/components/customer/products/ProductBreadcrumbs";
import { ProductCatalogCard } from "@/components/customer/products/ProductCatalogCard";
import { ProductsCategorySidebar } from "@/components/customer/products/ProductsCategorySidebar";
import { ProductsHelpBox } from "@/components/customer/products/ProductsHelpBox";
import { FadeIn } from "@/components/customer/FadeIn";
import { listActiveProducts } from "@/integrations/mongodb/products";
import {
  filterProductsByCategory,
  parseCatalogCategory,
  productCategoryLabels,
} from "@/lib/site/products";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const metadata = buildPageMetadata({
  title: "Products",
  description: "Browse industrial and agricultural machinery from XON.",
  path: "/products",
});

type SearchParams = { searchParams: Promise<{ category?: string }> };

export default async function ProductsPage({ searchParams }: SearchParams) {
  const { category: categoryParam } = await searchParams;
  const activeCategory = parseCatalogCategory(categoryParam);
  const allProducts = await listActiveProducts();
  const products = filterProductsByCategory(allProducts, activeCategory);

  const whatsappHref = getWhatsAppHref(
    "Hello XON, I need help choosing the right product from your catalog.",
  );

  const categoryTitle =
    activeCategory === "all"
      ? null
      : productCategoryLabels[activeCategory];

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
            {categoryTitle && (
              <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-brand-light">
                Showing: {categoryTitle}
              </p>
            )}
          </header>
        </FadeIn>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-12">
          <FadeIn delay={0.08} className="lg:sticky lg:top-28 lg:self-start">
            <aside>
              <ProductsCategorySidebar activeCategory={activeCategory} />
              <ProductsHelpBox whatsappHref={whatsappHref} />
            </aside>
          </FadeIn>

          <main>
            {products.length === 0 ? (
              <FadeIn>
                <div className="rounded-2xl border border-dashed border-slate-200 bg-surface px-8 py-16 text-center">
                  <p className="text-lg font-semibold text-slate-800">
                    No products in this category yet
                  </p>
                  <p className="mt-2 text-slate-600">
                    Try another category or message us on WhatsApp—we can source
                    equipment for your requirements.
                  </p>
                </div>
              </FadeIn>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product, index) => (
                  <FadeIn key={product._id} delay={0.06 + index * 0.03}>
                    <ProductCatalogCard product={product} />
                  </FadeIn>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
