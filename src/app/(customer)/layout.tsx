import { CustomerSiteShell } from "@/components/customer/CustomerSiteShell";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CustomerSiteShell>{children}</CustomerSiteShell>;
}
