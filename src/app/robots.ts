import { headers } from "next/headers";
import type { MetadataRoute } from "next";
import { hostsConfigured, isAdminHost, normalizeHost } from "@/lib/hosts";
import { getSiteUrl } from "@/lib/seo/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = normalizeHost(headersList.get("host"));

  if (hostsConfigured() && isAdminHost(host)) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/login",
        "/api/admin/",
        "/api/auth/",
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
