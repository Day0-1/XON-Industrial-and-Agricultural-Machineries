import type { Product, ProductCategory } from "@/types/product";

export const productCategoryLabels: Record<ProductCategory, string> = {
  industrial: "Industrial Machinery",
  agricultural: "Agricultural Machinery",
};

export const productCatalogCategories = [
  { id: "all", label: "All Products", href: "/products" },
  {
    id: "industrial",
    label: "Industrial Machinery",
    href: "/products?category=industrial",
  },
  {
    id: "agricultural",
    label: "Agricultural Machinery",
    href: "/products?category=agricultural",
  },
] as const;

export type CatalogCategoryId =
  (typeof productCatalogCategories)[number]["id"];

export function parseCatalogCategory(
  value: string | undefined,
): CatalogCategoryId {
  if (value === "industrial" || value === "agricultural") return value;
  return "all";
}

export function filterProductsByCategory(
  products: Product[],
  categoryId: CatalogCategoryId,
): Product[] {
  if (categoryId === "all") return products;
  return products.filter((product) => product.category === categoryId);
}

export function getDefaultProductFeatures(
  category: ProductCategory,
): string[] {
  if (category === "agricultural") {
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
    { label: "Category", value: productCategoryLabels[product.category] },
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
  "Additional photos, manuals, or technical sheets available on request.",
];
