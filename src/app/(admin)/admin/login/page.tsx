import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { MongoRequired } from "@/components/admin/MongoRequired";
import { SetupAdminForm } from "@/components/admin/SetupAdminForm";
import { isMongoConfigured } from "@/integrations/mongodb/client";
import { countAdmins } from "@/integrations/mongodb/admins";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  if (!isMongoConfigured()) {
    return <MongoRequired />;
  }

  const params = await searchParams;
  let needsSetup = false;

  try {
    needsSetup = (await countAdmins()) === 0;
  } catch {
    needsSetup = false;
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-white">
        {needsSetup ? (
          <>
            <h1 className="text-xl font-semibold">Create admin account</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Username, password, and 6-digit OTP are required before saving.
            </p>
            <div className="mt-6">
              <SetupAdminForm />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold">Admin sign in</h1>
            <p className="mt-1 text-sm text-zinc-400">XON dashboard</p>
            {params.created === "1" && (
              <p className="mt-3 rounded-md bg-emerald-950 px-3 py-2 text-sm text-emerald-300">
                Admin account created. Sign in with your username, password, and
                OTP.
              </p>
            )}
            <div className="mt-6">
              <Suspense
                fallback={<p className="text-sm text-zinc-400">Loading…</p>}
              >
                <LoginForm />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
