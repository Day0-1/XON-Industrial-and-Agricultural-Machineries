import { Check } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductBreadcrumbs } from "@/components/customer/products/ProductBreadcrumbs";
import { ProductDetailActions } from "@/components/customer/products/ProductDetailActions";
import { ProductDetailGallery } from "@/components/customer/products/ProductDetailGallery";
import { ProductDetailTabs } from "@/components/customer/products/ProductDetailTabs";
import { ProductsHelpBox } from "@/components/customer/products/ProductsHelpBox";
import { FadeIn } from "@/components/customer/FadeIn";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { getProductBySlug } from "@/integrations/mongodb/products";
import {
  getDefaultProductFeatures,
  productCategoryLabels,
} from "@/lib/site/products";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildProductInquiryMessage,
  getWhatsAppHref,
  getWhatsAppNumberIfConfigured,
} from "@/lib/whatsapp";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildPageMetadata({
      title: "Product",
      path: `/products/${slug}`,
    });
  }

  return buildPageMetadata({
    title: product.name,
    description: product.description.slice(0, 160),
    path: `/products/${slug}`,
    image: product.imageUrl,
    imageAlt: product.name,
  });
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categoryLabel = productCategoryLabels[product.category];
  const features = getDefaultProductFeatures(product.category);
  const summary =
    product.description.length > 220
      ? `${product.description.slice(0, 220).trim()}…`
      : product.description;

  const whatsappHref = getWhatsAppHref(
    `Hello XON, I need help with ${product.name}.`,
  );
  const chatHref = getWhatsAppHref(buildProductInquiryMessage(product.name));
  const whatsappNumber = getWhatsAppNumberIfConfigured();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <ProductJsonLd product={product} />
        <FadeIn>
          <ProductBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              {
                label: categoryLabel,
                href: `/products?category=${product.category}`,
              },
              { label: product.name },
            ]}
          />
        </FadeIn>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <FadeIn delay={0.05}>
            <ProductDetailGallery
              imageUrl={product.imageUrl}
              alt={product.name}
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div>
              <p className="text-sm text-slate-500">
                Category:{" "}
                <span className="font-medium text-slate-700">
                  {categoryLabel}
                </span>
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Pricing on request — inquire via WhatsApp
              </p>
              <p className="mt-6 text-base leading-relaxed text-slate-600">
                {summary}
              </p>

              <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-900">
                Key features
              </h2>
              <ul className="mt-3 space-y-2">
                {features.map((feature) => (
                  <li
                    key={feature}
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

              <ProductDetailActions
                productName={product.name}
                chatHref={chatHref}
                whatsappNumber={whatsappNumber}
              />
            </div>
          </FadeIn>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_minmax(0,16rem)] lg:gap-14">
          <FadeIn delay={0.12}>
            <ProductDetailTabs product={product} />
          </FadeIn>
          <FadeIn delay={0.16} className="lg:sticky lg:top-28 lg:self-start">
            <ProductsHelpBox whatsappHref={whatsappHref} compact />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
