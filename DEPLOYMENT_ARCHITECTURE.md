# Deployment Architecture — XON (GO54 / cPanel)

**Status:** Implemented (host middleware + `(admin)/admin` routes)  
**Constraints:** 1 GB RAM, single Node.js process, cPanel + Cloudflare, admin cloaked on apex domain

---

## 1. Infrastructure decision

| Requirement | Approach |
|-------------|----------|
| cPanel for DNS/email | GO54 JavaScript hosting; wildcard `*.thedomain.com` → same app |
| 1 GB RAM cap | **One** custom `server.js` process; `NODE_OPTIONS=--max-old-space-size=400` |
| Hide `/admin` on apex | Host-based middleware: apex `/admin*` → **404**; admin UI only on `admin.thedomain.com` |
| Full-stack in one deploy | Single codebase; middleware rewrites on admin host; shared `/api` tree |

This is **not** two separate Next.js apps. It is **one** build, **one** listener on `process.env.PORT`, **one** V8 heap budget.

---

## 2. Current codebase audit (baseline)

### Implemented today

| Asset | Location | Role |
|-------|----------|------|
| Custom Node entry | `server.js` | Wraps `next({ dev })`, listens on `process.env.PORT` |
| Auth gate | `src/middleware.ts` | Host-based routing; apex `/admin*` → 404; admin host rewrites |
| Customer UI | `src/app/(customer)/` | `/`, `/about`, `/contact`, `/products`, … |
| Admin UI | `src/app/(admin)/admin/` | Internal `/admin/*`; external on admin host: `/`, `/login`, `/products`, … |
| Shared API | `src/app/api/` | Public (`/api/products`), auth (`/api/auth/*`), admin (`/api/admin/*`) |
| Data layer | `src/integrations/mongodb/` | Single `getDb()` used by all route handlers |

### Gaps vs target

- ~~**No host-based routing**~~ — implemented in `src/middleware.ts` when `APEX_HOST` + `ADMIN_HOST` are set.
- ~~**Admin exposed on apex**~~ — apex `/admin*` and `/api/auth/*` return 404 when hosts are configured.
- ~~**No `_subdomains` tree**~~ — admin lives under `src/app/(admin)/admin/` (routable; apex blocked by middleware).

---

## 3. Folder hierarchy

Route groups `(customer)` and `(admin)` **do not** appear in URLs. Admin routes register as `/admin/*` internally; middleware rewrites clean URLs on the admin host.

```
src/app/
├── layout.tsx
├── (customer)/                   # Apex / www — public site
│   └── …
├── (admin)/admin/                # Internal /admin/* (404 on apex when hosts configured)
│   ├── login/page.tsx            # Admin host external URL: /login
│   └── (panel)/
│       ├── page.tsx              # Admin host external URL: /
│       └── products/...
└── api/
```

**External URL contract (admin host only)**

| Browser URL (`admin.thedomain.com`) | Internal rewrite |
|-------------------------------------|------------------|
| `/` | `/admin` (panel dashboard) |
| `/login` | `/admin/login` |
| `/products` | `/admin/products` |
| `/api/*` | No rewrite |

**Apex domain (`thedomain.com`)**

| Request | Response |
|---------|----------|
| `/admin`, `/admin/login`, `/admin/*` | `404` (native Next not-found, no redirect to login) |
| `/api/admin/*` | `404` on apex (optional: allow only from admin host via middleware) |
| `/`, `/products`, `/api/products`, … | Normal customer behavior |

---

## 4. Middleware design (`src/middleware.ts`)

Matcher should **exclude** static assets and Next internals:

```ts
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
```

### Pseudologic

```
host ← normalize(request.headers.get("host"))
isAdminHost ← host === ADMIN_HOST || host.endsWith("." + ADMIN_HOST)
isApex ← host === APEX_HOST || host === "www." + APEX_HOST

if (pathname is static/_next) → next()

if (isApex && pathname starts with "/admin") → return 404

if (isAdminHost) {
  if (pathname starts with "/api") → next()   // same-origin API
  url ← rewrite to /admin{pathname || ""}
  apply session guard on panel routes (not /login)
  return rewrite(url)
}

if (!isAdminHost && pathname starts with "/api/admin") → 404  // optional hardening

return next()
```

Session protection (existing `verifySessionToken`) moves to **admin host + panel paths** only. Login stays public on `admin.thedomain.com/login`.

### Cloudflare + cPanel DNS

1. **Apex / www** → cPanel app (Node).
2. **Wildcard** `*.thedomain.com` → same origin (or Cloudflare proxied CNAME).
3. Cloudflare SSL: Full (strict); Page Rules optional to force HTTPS on admin host.
4. `ADMIN_HOST=admin.thedomain.com`, `APEX_HOST=thedomain.com` in production env.

---

## 5. Single process and RAM envelope

### Why one process

| Split deployment (2× Next) | Single deployment |
|----------------------------|-------------------|
| 2× Node heaps (~300–500 MB each) | 1× capped heap (400 MB) |
| 2× `node_modules` resident copies if separate apps | One module graph |
| 2× Mongo connection pools | One pool via `getDb()` singleton |
| 2× cPanel Node “applications” fighting for 1 GB | One listener on `PORT` |

On a **1 GB** VPS/shared instance, the OS, MySQL/Mongo client buffers, and reverse proxy already consume **~200–350 MB**. Two uncapped Node 16+ processes commonly exceed the limit under traffic and trigger OOM kills.

**Single process math (planning):**

```
Total RAM:           1024 MB
OS + httpd/proxy:   ~250 MB (variable)
Node --max-old-space-size=400 → V8 heap cap
Remaining:           ~374 MB for native addons, Buffers, TLS, Mongo driver
```

`NODE_OPTIONS=--max-old-space-size=400` leaves headroom for non-heap memory while preventing runaway GC growth from taking the entire machine.

### CORS is not required

Customer pages call `/api/products` on `thedomain.com`. Admin panel calls `/api/admin/*` and `/api/auth/*` on `admin.thedomain.com`. Each is **same-origin** (scheme + host + port). Browser cookies for `xon_session` on the admin host stay host-scoped. No `Access-Control-Allow-Origin` layer is needed for first-party fetches.

---

## 6. Production `server.js`

Required for cPanel Node Selector: bind to the port cPanel injects, not a hardcoded value.

```js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error handling request:", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port} (${dev ? "development" : "production"})`);
  });
});
```

**cPanel setup:** Application root = project root; startup file = `server.js`; run script = `npm run start` (or `node server.js` with `NODE_ENV=production`).

---

## 7. Production environment variables

```bash
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=400
PORT=<set by cPanel — do not hardcode>

NEXT_PUBLIC_SITE_URL=https://thedomain.com
APEX_HOST=thedomain.com
ADMIN_HOST=admin.thedomain.com

MONGODB_URI=...
MONGODB_DB_NAME=xon
AUTH_SECRET=...
# Cloudinary, OTP, contact — as in .env.example
```

**Windows note:** `package.json` uses `NODE_ENV=production` (Unix). On GO54 Linux this is correct. For local Windows dev, use `cross-env` or set vars in the shell.

---

## 8. Implementation checklist

- [x] Add `APEX_HOST`, `ADMIN_HOST` to `.env.example` and production env
- [x] Admin UI under `(admin)/admin/` with middleware host routing
- [x] Rewrite `src/middleware.ts` for host detection, apex `/admin` → 404, admin rewrites
- [x] Update admin `Link`/`href` values to root-relative paths (`/products` not `/admin/products`)
- [x] Confirm `robots.ts` still disallows admin paths on apex
- [ ] Cloudflare: wildcard DNS + SSL; verify `Host` header reaches Node
- [ ] cPanel: single Node app, `NODE_OPTIONS` in application env UI
- [ ] Smoke test: apex `/admin` → 404; `admin.` host `/login` → 200; APIs on both hosts

---

## 9. References in repo

| File | Purpose |
|------|---------|
| `server.js` | Custom server (exists; align with §6 for production) |
| `src/middleware.ts` | Host routing, apex cloak, admin rewrites |
| `src/integrations/mongodb/client.ts` | Shared DB singleton |
| `src/app/api/**` | Unified API surface for both tenants |
