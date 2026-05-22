import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/integrations/mongodb/products";

type Params = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Edit product
      </h1>
      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
