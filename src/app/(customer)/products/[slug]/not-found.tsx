import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Product not found",
  path: "/products",
  noIndex: true,
});

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <Link href="/products" className="mt-4 inline-block text-sm font-medium hover:underline">
        Back to products
      </Link>
    </div>
  );
}
