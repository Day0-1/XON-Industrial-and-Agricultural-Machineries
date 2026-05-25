export function normalizeHost(host: string | null): string {
  if (!host) return "";
  return host.split(":")[0]?.toLowerCase() ?? "";
}

export function getApexHost(): string {
  return process.env.APEX_HOST?.trim().toLowerCase() ?? "";
}

export function getAdminHost(): string {
  return process.env.ADMIN_HOST?.trim().toLowerCase() ?? "";
}

export function hostsConfigured(): boolean {
  return Boolean(getApexHost() && getAdminHost());
}

export function isAdminHost(host: string): boolean {
  const admin = getAdminHost();
  if (!admin) return false;
  return host === admin;
}

export function isApexHost(host: string): boolean {
  const apex = getApexHost();
  if (!apex) return false;
  return host === apex || host === `www.${apex}`;
}

/** Internal routable prefix for admin UI (blocked on apex by middleware). */
export const ADMIN_INTERNAL_PREFIX = "/admin";

/** Map internal /admin/* path to clean admin-host URL (/products, /, …). */
export function toAdminExternalPath(internalPath: string): string {
  if (
    internalPath === ADMIN_INTERNAL_PREFIX ||
    internalPath === `${ADMIN_INTERNAL_PREFIX}/`
  ) {
    return "/";
  }
  if (internalPath.startsWith(`${ADMIN_INTERNAL_PREFIX}/`)) {
    return internalPath.slice(ADMIN_INTERNAL_PREFIX.length) || "/";
  }
  return internalPath;
}
