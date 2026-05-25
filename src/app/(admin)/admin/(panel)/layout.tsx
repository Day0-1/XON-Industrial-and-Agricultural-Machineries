import { AdminShell } from "@/components/admin/AdminShell";
import { MongoRequired } from "@/components/admin/MongoRequired";
import { isMongoConfigured } from "@/integrations/mongodb/client";
import { getSiteUrl } from "@/lib/seo/site";

export default function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isMongoConfigured()) {
    return <MongoRequired />;
  }

  return <AdminShell siteUrl={getSiteUrl()}>{children}</AdminShell>;
}
