import Link from "next/link";
import { AdminAuthLayout } from "@/components/admin/AdminAuthLayout";
import { getSiteUrl } from "@/lib/seo/site";

export function MongoRequired() {
  return (
    <AdminAuthLayout
      badge="Configuration"
      title="Database not configured"
      description="The admin panel needs MongoDB before you can sign in or manage the catalog."
      footer={
        <Link
          href={getSiteUrl()}
          className="inline-flex text-sm font-semibold text-slate-900 hover:text-slate-700"
        >
          Back to customer website →
        </Link>
      }
    >
      <div className="text-sm leading-relaxed text-slate-600">
        <p>
          Add <code className="rounded-lg bg-white px-1.5 py-0.5 font-mono text-xs text-slate-800">MONGODB_URI</code> to{" "}
          <code className="rounded-lg bg-white px-1.5 py-0.5 font-mono text-xs text-slate-800">.env</code>
          , restart the dev server, then return here.
        </p>
      </div>
    </AdminAuthLayout>
  );
}
