import { getSiteUrl } from "@/lib/seo/site";

export type BreadcrumbJsonLdItem = {
  label: string;
  href?: string;
};

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbJsonLdItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href
        ? { item: `${getSiteUrl()}${item.href.startsWith("/") ? item.href : `/${item.href}`}` }
        : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
