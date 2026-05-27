import { getSiteUrl, siteConfig } from "@/lib/seo/site";
import type { Product } from "@/types/product";

export function ProductJsonLd({ product }: { product: Product }) {
  const productUrl = `${getSiteUrl()}/products/${product.slug}`;
  const images = product.images.map((img) => img.imageUrl);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images.length === 1 ? images[0] : images,
    url: productUrl,
    sku: product.slug,
    category: product.collectionName,
    brand: {
      "@type": "Brand",
      name: siteConfig.shortName,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      availability: "https://schema.org/InStock",
      priceCurrency: "NGN",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
