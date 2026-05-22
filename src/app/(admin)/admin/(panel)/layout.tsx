import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { MongoRequired } from "@/components/admin/MongoRequired";
import { isMongoConfigured } from "@/integrations/mongodb/client";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
] as const;

export default function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isMongoConfigured()) {
    return <MongoRequired />;
  }

  return (
    <div className="flex min-h-full flex-1">
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-300">
        <div className="border-b border-zinc-800 px-4 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Admin
          </p>
          <p className="mt-1 text-lg font-semibold text-white">XON Panel</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-900 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-800 p-3">
          <Link
            href="/"
            className="mb-2 block rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            View website
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-900">
        <main className="flex flex-1 flex-col p-6">{children}</main>
      </div>
    </div>
  );
}
