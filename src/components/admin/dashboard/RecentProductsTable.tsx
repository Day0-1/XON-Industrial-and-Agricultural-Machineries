import Image from "next/image";
import Link from "next/link";
import { formatClickCount, formatClickCountFull } from "@/lib/admin/format";

type RecentProduct = {
  _id: string;
  name: string;
  imageUrl: string;
  collectionName: string;
  clickCount: number;
  active: boolean;
  updatedAt: string;
};

export function RecentProductsTable({ products }: { products: RecentProduct[] }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)] lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-slate-900">Recent products</p>
          <p className="text-sm text-slate-500">Latest updates with click counts</p>
        </div>
        <Link
          href="/products"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          View all
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="pb-3 pr-4">Product</th>
              <th className="pb-3 pr-4">Collection</th>
              <th className="pb-3 pr-4">Clicks</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="group hover:bg-slate-50/80">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-slate-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-slate-600">{product.collectionName}</td>
                  <td className="py-4 pr-4">
                    <span className="font-bold text-slate-900">
                      {formatClickCount(product.clickCount)}
                    </span>
                    <span className="ml-1 text-xs text-slate-400">
                      ({formatClickCountFull(product.clickCount)})
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {product.active ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-4">
                    <Link
                      href={`/products/${product._id}/edit`}
                      className="font-semibold text-slate-900 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
