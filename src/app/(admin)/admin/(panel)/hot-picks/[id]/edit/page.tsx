import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HotPickForm } from "@/components/admin/HotPickForm";
import { getHotPickById } from "@/integrations/mongodb/hot-picks";

type Params = { params: Promise<{ id: string }> };

export default async function EditHotPickPage({ params }: Params) {
  const { id } = await params;
  const hotPick = await getHotPickById(id);
  if (!hotPick) notFound();

  return (
    <>
      <AdminPageHeader
        title="Edit hot pick"
        description={hotPick.title}
      />
      <HotPickForm hotPick={hotPick} mode="edit" />
    </>
  );
}
