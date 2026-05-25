import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ClicksBarChart } from "@/components/admin/dashboard/ClicksBarChart";
import { ClicksGaugeCard } from "@/components/admin/dashboard/ClicksGaugeCard";
import { RecentProductsTable } from "@/components/admin/dashboard/RecentProductsTable";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { TopCollectionsCard } from "@/components/admin/dashboard/TopCollectionsCard";
import { TopProductsCard } from "@/components/admin/dashboard/TopProductsCard";
import { getDashboardStats } from "@/integrations/mongodb/analytics";
import { formatClickCount } from "@/lib/admin/format";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="rounded-[28px] bg-white p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
        <p className="text-slate-600">Unable to load dashboard. Check MongoDB connection.</p>
      </div>
    );
  }

  const topProductClicks = stats.topProducts[0]?.clickCount ?? 0;
  const maxCollectionClicks = Math.max(
    ...stats.topCollections.map((c) => c.clicks),
    0,
  );

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Catalog performance and product click analytics"
        actionHref="/products/new"
        actionLabel="Add product"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total clicks"
          value={formatClickCount(stats.totalClicks)}
          hint="Customer product page views"
        />
        <StatCard
          label="Products"
          value={String(stats.totalProducts)}
          hint={`${stats.activeProducts} live on site`}
        />
        <StatCard
          label="Collections"
          value={String(stats.totalCollections)}
          hint="Catalog categories"
        />
        <StatCard
          label="Top product"
          value={formatClickCount(topProductClicks)}
          hint={stats.topProducts[0]?.name ?? "—"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <ClicksBarChart
          monthlyClicks={stats.monthlyClicks}
          totalClicks={stats.totalClicks}
        />
        <ClicksGaugeCard
          totalClicks={stats.totalClicks}
          activeProducts={stats.activeProducts}
          topProductClicks={topProductClicks}
        />
      </div>

      <RecentProductsTable products={stats.recentProducts} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TopCollectionsCard
          collections={stats.topCollections}
          maxClicks={maxCollectionClicks}
        />
        <TopProductsCard products={stats.topProducts} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/products"
          className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
        >
          Manage products
        </Link>
        <Link
          href="/collections"
          className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
        >
          Manage collections
        </Link>
      </div>
    </>
  );
}
