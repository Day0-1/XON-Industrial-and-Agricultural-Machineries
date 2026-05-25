import Link from "next/link";
import { formatClickCount } from "@/lib/admin/format";

type TopCollection = {
  name: string;
  slug: string;
  clicks: number;
  productCount: number;
};

export function TopCollectionsCard({
  collections,
  maxClicks,
}: {
  collections: TopCollection[];
  maxClicks: number;
}) {
  const peak = Math.max(maxClicks, 1);

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
      <p className="text-lg font-bold text-slate-900">Top collections</p>
      <p className="text-sm text-slate-500">Clicks across products</p>

      <ul className="mt-5 space-y-4">
        {collections.length === 0 ? (
          <li className="text-sm text-slate-500">No collections yet.</li>
        ) : (
          collections.map((col) => {
            const width = Math.max(8, (col.clicks / peak) * 100);
            return (
              <li key={col.slug}>
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/collections`}
                    className="text-sm font-semibold text-slate-900 hover:underline"
                  >
                    {col.name}
                  </Link>
                  <span className="text-sm font-bold text-slate-900">
                    {formatClickCount(col.clicks)}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-all"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {col.productCount} product{col.productCount === 1 ? "" : "s"}
                </p>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
