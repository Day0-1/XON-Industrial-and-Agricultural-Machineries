import type { Collection } from "@/types/collection";
import type { Product } from "@/types/product";

export type CatalogNavItem = {
  id: string;
  label: string;
  href: string;
};

export function buildCatalogNav(collections: Collection[]): CatalogNavItem[] {
  return [
    { id: "all", label: "All Products", href: "/products" },
    ...collections.map((col) => ({
      id: col.slug,
      label: col.name,
      href: `/products?category=${col.slug}`,
    })),
  ];
}

export function parseCatalogCategory(
  value: string | undefined,
  validSlugs: string[],
): string {
  if (!value || value === "all") return "all";
  const slug = value.trim().toLowerCase();
  return validSlugs.includes(slug) ? slug : "all";
}

export function filterProductsByCategory(
  products: Product[],
  categoryId: string,
): Product[] {
  if (categoryId === "all") return products;
  return products.filter((product) => product.collectionSlug === categoryId);
}

export function getProductFeatures(product: Product): string[] {
  if (product.features.length > 0) return product.features;
  return getDefaultProductFeatures(product.collectionSlug);
}

export function getDefaultProductFeatures(collectionSlug: string): string[] {
  if (collectionSlug === "agricultural") {
    return [
      "Built for farm and field workloads",
      "Durable construction for daily use",
      "Suited to Nigerian climate and terrain",
      "Full specs available on request",
    ];
  }

  return [
    "High efficiency and durable build",
    "Professional-grade components",
    "Low maintenance operation",
    "Full specs and documentation on request",
  ];
}

export function getProductSpecifications(
  product: Product,
): { label: string; value: string }[] {
  return [
    { label: "Collection", value: product.collectionName },
    { label: "Product", value: product.name },
    {
      label: "Availability",
      value: "Confirm via WhatsApp — pricing and stock on request",
    },
    {
      label: "Support",
      value: "Guidance on selection, delivery, and after-sale inquiries",
    },
  ];
}

export const productOrderingNotes = [
  "Orders and payments are arranged directly on WhatsApp — not on this website.",
  "Share your quantity, delivery location, and timeline when you message us.",
  "We respond with current pricing, availability, and next steps.",
  "Additional photos, manuals, or technical sheets available on request",
];
