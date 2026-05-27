import type { NextRequest } from "next/server";
import {
  hostsConfigured,
  isAdminHost,
  normalizeHost,
} from "@/lib/hosts";

/** Paths and hosts that must never appear in search indexes. */
export function shouldNoIndexRequest(request: NextRequest): boolean {
  const host = normalizeHost(request.headers.get("host"));
  const { pathname } = request.nextUrl;

  if (hostsConfigured() && isAdminHost(host)) {
    return true;
  }

  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/auth/")
  );
}

export const NO_INDEX_ROBOTS_HEADER = "noindex, nofollow, noarchive";
