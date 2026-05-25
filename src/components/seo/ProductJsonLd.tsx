import { getSiteUrl } from "@/lib/seo/site";
import type { Product } from "@/types/product";

export function ProductJsonLd({ product }: { product: Product }) {
  const images = product.images.map((img) => img.imageUrl);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images.length === 1 ? images[0] : images,
    url: `${getSiteUrl()}/products/${product.slug}`,
    category: product.collectionName,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
