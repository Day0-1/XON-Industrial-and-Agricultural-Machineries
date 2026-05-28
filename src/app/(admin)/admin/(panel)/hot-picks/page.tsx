import Image from "next/image";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteHotPickButton } from "@/components/admin/DeleteHotPickButton";
import { listAllHotPicks } from "@/integrations/mongodb/hot-picks";

export default async function AdminHotPicksPage() {
  const hotPicks = await listAllHotPicks();

  return (
    <>
      <AdminPageHeader
        title="Hot picks"
        description="Homepage banners — image, title, description, optional link"
        action={
          <Link
            href="/hot-picks/new"
            className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Add banner
          </Link>
        }
      />

      {hotPicks.length === 0 ? (
        <div className="rounded-[28px] bg-white p-10 text-center shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
          <p className="text-slate-500">No banners yet. Add your first hot pick.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-50 overflow-hidden rounded-[28px] bg-white shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
          {hotPicks.map((pick) => (
            <li
              key={pick._id}
              className="flex flex-wrap items-center gap-4 px-6 py-5 hover:bg-slate-50/60"
            >
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={pick.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{pick.title}</p>
                <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
                  {pick.description || "No description"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Order {pick.sortOrder} · {pick.active ? "Visible" : "Hidden"}
                  {pick.linkUrl ? ` · Link: ${pick.linkUrl}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/hot-picks/${pick._id}/edit`}
                  className="text-sm font-semibold text-slate-900 hover:underline"
                >
                  Edit
                </Link>
                <DeleteHotPickButton hotPickId={pick._id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
