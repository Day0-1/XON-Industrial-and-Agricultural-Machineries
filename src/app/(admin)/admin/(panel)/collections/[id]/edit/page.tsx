import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { getCollectionById } from "@/integrations/mongodb/collections";

type Params = { params: Promise<{ id: string }> };

export default async function EditCollectionPage({ params }: Params) {
  const { id } = await params;
  const collection = await getCollectionById(id);
  if (!collection) notFound();

  return (
    <>
      <AdminPageHeader
        title="Edit collection"
        description={`Slug: ${collection.slug}`}
      />
      <div className="rounded-[28px] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)] sm:p-8">
        <CollectionForm collection={collection} mode="edit" />
      </div>
    </>
  );
}
