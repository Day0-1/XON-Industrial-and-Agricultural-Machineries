import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HotPickForm } from "@/components/admin/HotPickForm";

export default function NewHotPickPage() {
  return (
    <>
      <AdminPageHeader
        title="Add hot pick"
        description="Upload a banner for the homepage carousel"
      />
      <HotPickForm mode="create" />
    </>
  );
}
