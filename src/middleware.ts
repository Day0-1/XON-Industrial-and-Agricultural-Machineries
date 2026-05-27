import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth/token";
import {
  ADMIN_INTERNAL_PREFIX,
  hostsConfigured,
  isAdminHost,
  isApexHost,
  normalizeHost,
  toAdminExternalPath,
} from "@/lib/hosts";
import {
  NO_INDEX_ROBOTS_HEADER,
  shouldNoIndexRequest,
} from "@/lib/seo/crawl";

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

function notFound() {
  return new NextResponse(null, { status: 404 });
}

function withCrawlHeaders(
  response: NextResponse,
  request: NextRequest,
): NextResponse {
  if (shouldNoIndexRequest(request)) {
    response.headers.set("X-Robots-Tag", NO_INDEX_ROBOTS_HEADER);
  }
  return response;
}

function isAdminLoginPath(pathname: string): boolean {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

function legacyPathMiddleware(request: NextRequest, pathname: string) {
  const isAdminPage =
    pathname.startsWith("/admin") && !isAdminLoginPath(pathname);
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  return requireSession(request, {
    isAdminApi,
    redirectPath: pathname,
    loginPath: "/admin/login",
  });
}

async function requireSession(
  request: NextRequest,
  options: {
    isAdminApi: boolean;
    redirectPath: string;
    loginPath: string;
  },
) {
  const valid = await hasValidSession(request);

  if (!valid) {
    if (options.isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL(options.loginPath, request.url);
    loginUrl.searchParams.set("from", options.redirectPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

async function runMiddleware(request: NextRequest): Promise<NextResponse> {
  const host = normalizeHost(request.headers.get("host"));
  const { pathname } = request.nextUrl;

  if (!hostsConfigured()) {
    return legacyPathMiddleware(request, pathname);
  }

  if (isApexHost(host)) {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return notFound();
    }
    if (
      pathname.startsWith("/api/admin") ||
      pathname.startsWith("/api/auth/")
    ) {
      return notFound();
    }
    return NextResponse.next();
  }

  if (isAdminHost(host)) {
    if (pathname.startsWith("/api")) {
      if (pathname.startsWith("/api/admin")) {
        return requireSession(request, {
          isAdminApi: true,
          redirectPath: pathname,
          loginPath: "/login",
        });
      }
      return NextResponse.next();
    }

    if (pathname === "/login" || pathname.startsWith("/login/")) {
      if (await hasValidSession(request)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.rewrite(
        new URL(`${ADMIN_INTERNAL_PREFIX}/login`, request.url),
      );
    }

    if (isAdminLoginPath(pathname)) {
      if (await hasValidSession(request)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (pathname !== "/admin/login") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith(ADMIN_INTERNAL_PREFIX)) {
      return requireSession(request, {
        isAdminApi: false,
        redirectPath: toAdminExternalPath(pathname),
        loginPath: "/login",
      });
    }

    if (!(await hasValidSession(request))) {
      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/") {
        loginUrl.searchParams.set("from", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    const internalPath =
      pathname === "/"
        ? ADMIN_INTERNAL_PREFIX
        : `${ADMIN_INTERNAL_PREFIX}${pathname}`;

    return NextResponse.rewrite(new URL(internalPath, request.url));
  }

  if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/auth/")) {
    return notFound();
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  const response = await runMiddleware(request);
  return withCrawlHeaders(response, request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|avif)$).*)",
  ],
};
