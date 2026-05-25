"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function CustomerMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main
      id="page-top"
      className={`flex flex-1 flex-col ${isHome ? "" : "pt-[7.25rem]"}`}
    >
      {children}
    </main>
  );
}
