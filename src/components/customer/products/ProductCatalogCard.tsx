import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCatalogCardProps = {
  product: Product;
};

export function ProductCatalogCard({ product }: ProductCatalogCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_32px_-12px_rgba(15,23,42,0.1)] transition-shadow hover:shadow-[0_16px_40px_-12px_rgba(15,23,42,0.14)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-light">
          {product.collectionName}
        </p>
        <h3 className="mt-1 truncate text-lg font-bold leading-snug text-slate-900">
          {product.name}
        </h3>
        <Link
          href={`/products/${product.slug}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-accent-hover"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
