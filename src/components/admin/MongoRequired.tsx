import Link from "next/link";
import { getSiteUrl } from "@/lib/seo/site";

export function MongoRequired() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-white">
        <h1 className="text-xl font-semibold">Database not configured</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Add <code className="text-zinc-200">MONGODB_URI</code> to{" "}
          <code className="text-zinc-200">.env.local</code>, restart the dev
          server, then return to the admin area.
        </p>
        <Link
          href={getSiteUrl()}
          className="mt-6 inline-block text-sm font-medium text-zinc-300 hover:text-white"
        >
          Back to website
        </Link>
      </div>
    </div>
  );
}
