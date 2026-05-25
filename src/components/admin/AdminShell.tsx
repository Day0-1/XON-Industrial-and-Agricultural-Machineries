"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

type AdminShellProps = {
  siteUrl: string;
  children: React.ReactNode;
};

export function AdminShell({ siteUrl, children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function closeMobileNav() {
    setMobileNavOpen(false);
  }

  useEffect(() => {
    closeMobileNav();
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;

    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeMobileNav();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileNavOpen]);

  const sidebarProps = {
    siteUrl,
    onLogout: handleLogout,
    onNavigate: closeMobileNav,
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#e8ecf3] lg:flex-row lg:gap-6 lg:p-6">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/80 bg-[#e8ecf3]/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-800 shadow-sm"
          aria-label="Open menu"
          aria-expanded={mobileNavOpen}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            XON Admin
          </p>
          <p className="text-sm font-bold text-slate-900">Panel</p>
        </div>
      </header>

      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
          onClick={closeMobileNav}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(288px,88vw)] p-3 transition-transform duration-300 ease-out lg:hidden ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        aria-hidden={!mobileNavOpen}
      >
        <AdminSidebar
          {...sidebarProps}
          showClose
          onClose={closeMobileNav}
          className="h-full overflow-y-auto rounded-r-[28px] rounded-l-2xl shadow-2xl"
        />
      </div>

      <div className="hidden w-[260px] shrink-0 lg:block">
        <div className="sticky top-6">
          <AdminSidebar {...sidebarProps} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-5 lg:p-0">
        {children}
      </div>
    </div>
  );
}
