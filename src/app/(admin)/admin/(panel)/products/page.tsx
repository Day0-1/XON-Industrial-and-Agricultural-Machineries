import Image from "next/image";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { listAllProducts } from "@/integrations/mongodb/products";

export default async function AdminProductsPage() {
  const products = await listAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
        >
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-zinc-500">No products yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {products.map((product) => (
            <li
              key={product._id}
              className="flex flex-wrap items-center gap-4 p-4"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-950 dark:text-zinc-50">
                  {product.name}
                </p>
                <p className="text-sm text-zinc-500">
                  {product.category} · {product.active ? "Active" : "Hidden"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/products/${product._id}/edit`}
                  className="text-sm font-medium hover:underline"
                >
                  Edit
                </Link>
                <DeleteProductButton productId={product._id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
