"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateCollectionModal } from "@/components/admin/CreateCollectionModal";

type CreateCollectionButtonProps = {
  label?: string;
};

export function CreateCollectionButton({
  label = "Add collection",
}: CreateCollectionButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" aria-hidden />
        {label}
      </button>
      <CreateCollectionModal open={open} onClose={handleClose} />
    </>
  );
}
