import Image from "next/image";
import Link from "next/link";
import { formatClickCount, formatClickCountFull } from "@/lib/admin/format";

type TopProduct = {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  clickCount: number;
  collectionName: string;
};

export function TopProductsCard({ products }: { products: TopProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
        <p className="font-bold text-slate-900">Top products</p>
        <p className="mt-4 text-sm text-slate-500">No products yet.</p>
      </div>
    );
  }

  const [featured, ...rest] = products;

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
      <p className="text-lg font-bold text-slate-900">Top products</p>
      <p className="text-sm text-slate-500">By customer page clicks</p>

      <Link
        href={`/products/${featured._id}/edit`}
        className="mt-5 block overflow-hidden rounded-[22px] bg-slate-900 p-4 text-white shadow-lg shadow-slate-900/20 transition-transform hover:scale-[1.01]"
      >
        <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-800">
          <Image
            src={featured.imageUrl}
            alt={featured.name}
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            className="object-cover opacity-90"
          />
        </div>
        <p className="mt-4 font-semibold">{featured.name}</p>
        <p className="mt-1 text-2xl font-bold">
          {formatClickCount(featured.clickCount)} clicks
        </p>
        <p className="text-xs text-slate-400">
          {formatClickCountFull(featured.clickCount)} · {featured.collectionName}
        </p>
      </Link>

      <ul className="mt-4 space-y-3">
        {rest.map((product) => (
          <li key={product._id}>
            <Link
              href={`/products/${product._id}/edit`}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 p-2 transition-colors hover:bg-slate-50"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {product.name}
                </p>
                <p className="text-xs text-slate-500">{product.collectionName}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-slate-900">
                {formatClickCount(product.clickCount)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
