import { Check } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductBreadcrumbs } from "@/components/customer/products/ProductBreadcrumbs";
import { ProductDetailActions } from "@/components/customer/products/ProductDetailActions";
import { ProductDetailGallery } from "@/components/customer/products/ProductDetailGallery";
import { ProductDetailTabs } from "@/components/customer/products/ProductDetailTabs";
import { ProductsHelpBox } from "@/components/customer/products/ProductsHelpBox";
import { FadeIn } from "@/components/customer/FadeIn";
import { ProductViewTracker } from "@/components/customer/products/ProductViewTracker";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { getProductBySlug } from "@/integrations/mongodb/products";
import { getProductFeatures } from "@/lib/site/products";
import { customerPageShellClass } from "@/lib/site/customer-layout";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getProductShareImage } from "@/lib/seo/product-share";
import {
  buildProductInquiryMessage,
  buildProductPurchaseMessage,
  getWhatsAppHref,
  getWhatsAppNumberIfConfigured,
} from "@/lib/whatsapp";

type Params = { params: Promise<{ slug: string }> };

// Avoid stale product/not-found responses when catalog updates frequently.
export const revalidate = 0;

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildPageMetadata({
      title: "Product not found",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  const shareImage = getProductShareImage(product);
  const description = truncateText(product.description ?? "", 160);

  return buildPageMetadata({
    title: product.name,
    description,
    path: `/products/${slug}`,
    image: shareImage?.url,
    imageAlt: product.name,
    imageWidth: shareImage?.width,
    imageHeight: shareImage?.height,
  });
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categoryLabel = product.collectionName;
  const features =
    product.features.length > 0
      ? product.features
      : getProductFeatures(product);
  const summary = truncateText(product.description ?? "", 220);

  const whatsappHref = getWhatsAppHref(
    buildProductPurchaseMessage(product.name, product.slug),
  );
  const chatHref = getWhatsAppHref(
    buildProductInquiryMessage(product.name, product.slug),
  );
  const whatsappNumber = getWhatsAppNumberIfConfigured();

  return (
    <div className="bg-white">
      <div className={customerPageShellClass}>
        <BreadcrumbJsonLd
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            {
              label: categoryLabel,
              href: `/products?category=${product.collectionSlug}`,
            },
            { label: product.name },
          ]}
        />
        <ProductJsonLd product={product} />
        <ProductViewTracker slug={product.slug} />
        <FadeIn>
          <ProductBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              {
                label: categoryLabel,
                href: `/products?category=${product.collectionSlug}`,
              },
              { label: product.name },
            ]}
          />
        </FadeIn>

        <div className="mt-6 grid gap-8 sm:mt-10 lg:grid-cols-2 lg:gap-14">
          <FadeIn delay={0.05}>
            <ProductDetailGallery images={product.images} alt={product.name} />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div>
              <p className="text-sm text-slate-500">
                Category:{" "}
                <span className="font-medium text-slate-700">
                  {categoryLabel}
                </span>
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Pricing on request — inquire via WhatsApp
              </p>
              <p className="mt-6 text-base leading-relaxed text-slate-600">
                {summary}
              </p>

              {features.length > 0 && (
                <>
                  <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-900">
                    Key features
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {features.map((feature, index) => (
                      <li
                        key={`${feature}-${index}`}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                          aria-hidden
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <ProductDetailActions
                productName={product.name}
                productSlug={product.slug}
                chatHref={chatHref}
                whatsappNumber={whatsappNumber}
              />
            </div>
          </FadeIn>
        </div>

        <div className="mt-10 grid gap-8 sm:mt-16 lg:grid-cols-[1fr_minmax(0,16rem)] lg:gap-14">
          <FadeIn delay={0.12} className="min-w-0">
            <ProductDetailTabs product={product} />
          </FadeIn>
          <FadeIn delay={0.16} className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <ProductsHelpBox whatsappHref={whatsappHref} compact />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
