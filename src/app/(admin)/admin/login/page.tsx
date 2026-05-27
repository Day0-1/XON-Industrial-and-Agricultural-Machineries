import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminAuthLayout } from "@/components/admin/AdminAuthLayout";
import { adminSuccessClass } from "@/components/admin/AdminFields";
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

  if (needsSetup) {
    return (
      <AdminAuthLayout
        badge="First-time setup"
        title="Create admin account"
        description="Set your dashboard username and password. You will also need the setup code from your environment file."
      >
        <SetupAdminForm />
      </AdminAuthLayout>
    );
  }

  return (
    <AdminAuthLayout
      badge="Secure access"
      title="Sign in to admin"
      description="Enter your credentials, then verify with the one-time code emailed to the admin inbox."
      footer={
        params.created === "1" ? (
          <p className={adminSuccessClass}>
            Admin account created. Sign in to receive your verification code by
            email.
          </p>
        ) : undefined
      }
    >
      <Suspense
        fallback={
          <p className="text-sm text-slate-500">Loading sign-in form…</p>
        }
      >
        <LoginForm />
      </Suspense>
    </AdminAuthLayout>
  );
}
