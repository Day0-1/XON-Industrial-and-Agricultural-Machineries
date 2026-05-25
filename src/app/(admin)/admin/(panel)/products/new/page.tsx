import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { listAllCollections } from "@/integrations/mongodb/collections";

export default async function NewProductPage() {
  const collections = await listAllCollections();

  return (
    <>
      <AdminPageHeader title="New product" description="Add an item to the catalog" />
      <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)] sm:p-8">
        <ProductForm collections={collections} />
      </div>
    </>
  );
}
