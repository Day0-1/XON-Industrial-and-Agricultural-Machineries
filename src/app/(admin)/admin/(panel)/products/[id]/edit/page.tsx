import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { listAllCollections } from "@/integrations/mongodb/collections";
import { getProductById } from "@/integrations/mongodb/products";

type Params = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  const [product, collections] = await Promise.all([
    getProductById(id),
    listAllCollections(),
  ]);
  if (!product) notFound();

  return (
    <>
      <AdminPageHeader
        title="Edit product"
        description={`${product.clickCount.toLocaleString()} clicks · ${product.collectionName}`}
      />
      <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)] sm:p-8">
        <ProductForm product={product} collections={collections} />
      </div>
    </>
  );
}
