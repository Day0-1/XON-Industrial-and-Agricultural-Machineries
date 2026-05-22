import Link from "next/link";
import { listAllProducts } from "@/integrations/mongodb/products";

export default async function AdminDashboardPage() {
  const products = await listAllProducts();
  const active = products.filter((p) => p.active).length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Dashboard
      </h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-500">Total products</p>
          <p className="mt-2 text-2xl font-semibold">{products.length}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-500">Active on site</p>
          <p className="mt-2 text-2xl font-semibold">{active}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-500">Inactive</p>
          <p className="mt-2 text-2xl font-semibold">
            {products.length - active}
          </p>
        </div>
      </div>
      <Link
        href="/admin/products/new"
        className="mt-8 inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
      >
        Add product
      </Link>
    </div>
  );
}
