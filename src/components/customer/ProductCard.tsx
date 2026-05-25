import Image from "next/image";
import Link from "next/link";
import {
  buildProductInquiryMessage,
  getWhatsAppHref,
} from "@/lib/whatsapp";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  emphasized?: boolean;
};

export function ProductCard({ product, emphasized = false }: ProductCardProps) {
  const whatsappHref = getWhatsAppHref(
    buildProductInquiryMessage(product.name),
  );

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] transition-all hover:shadow-[0_16px_48px_-12px_rgba(15,23,42,0.18)] ${
        emphasized
          ? "border-brand ring-2 ring-brand/25"
          : "border-slate-100"
      }`}
    >
      <div className="relative aspect-[4/3] bg-slate-100">
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
        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
          {product.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brand hover:text-brand"
          >
            View details
          </Link>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1da851]"
            >
              Inquire on WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
