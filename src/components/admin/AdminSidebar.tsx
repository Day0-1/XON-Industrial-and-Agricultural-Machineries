"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Package,
  ExternalLink,
  X,
} from "lucide-react";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/collections", label: "Collections", icon: FolderOpen },
  { href: "/hot-picks", label: "Hot picks", icon: Megaphone },
] as const;

type AdminSidebarProps = {
  siteUrl: string;
  onLogout: () => void;
  onNavigate?: () => void;
  showClose?: boolean;
  onClose?: () => void;
  className?: string;
};

export function AdminSidebar({
  siteUrl,
  onLogout,
  onNavigate,
  showClose = false,
  onClose,
  className = "",
}: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      className={`flex h-full flex-col rounded-[28px] bg-white p-5 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)] ${className}`}
    >
      <div className="flex items-start justify-between gap-3 px-2 py-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            XON
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">Admin Panel</p>
        </div>
        {showClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      <p className="mt-6 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 lg:mt-8">
        Menu
      </p>
      <nav className="mt-3 flex flex-col gap-1">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <p className="mt-8 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Others
      </p>
      <div className="mt-3 flex flex-col gap-1">
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <ExternalLink className="h-[18px] w-[18px]" aria-hidden />
          View website
        </a>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            onLogout();
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden />
          Sign out
        </button>
      </div>

      <div className="mt-auto rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-900">Catalog analytics</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Product clicks update when customers open a product page.
        </p>
      </div>
    </aside>
  );
}
