import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CreateCollectionButton } from "@/components/admin/CreateCollectionButton";
import { DeleteCollectionButton } from "@/components/admin/DeleteCollectionButton";
import {
  countProductsInCollection,
  listAllCollections,
} from "@/integrations/mongodb/collections";

export default async function AdminCollectionsPage() {
  const collections = await listAllCollections();
  const productCounts = await Promise.all(
    collections.map((col) => countProductsInCollection(col._id)),
  );

  return (
    <>
      <AdminPageHeader
        title="Collections"
        description="Categories for the customer catalog (?category=slug)"
        action={<CreateCollectionButton />}
      />

      {collections.length === 0 ? (
        <div className="rounded-[28px] bg-white p-10 text-center shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
          <p className="text-slate-500">No collections yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-50 overflow-hidden rounded-[28px] bg-white shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
          {collections.map((col, index) => (
            <li
              key={col._id}
              className="flex flex-wrap items-center gap-4 px-6 py-5 hover:bg-slate-50/60"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{col.name}</p>
                <p className="text-sm text-slate-500">
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                    {col.slug}
                  </code>{" "}
                  · {productCounts[index]} product
                  {productCounts[index] === 1 ? "" : "s"} ·{" "}
                  {col.active ? "Visible" : "Hidden"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/collections/${col._id}/edit`}
                  className="text-sm font-semibold text-slate-900 hover:underline"
                >
                  Edit
                </Link>
                <DeleteCollectionButton collectionId={col._id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
