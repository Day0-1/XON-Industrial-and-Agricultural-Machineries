# GO54 deploy — Next.js standalone bundle

Use this flow on **1 GB** hosting: build on your PC, upload a small zip, run **no** `npm run build` on the server.

For host-based routing (apex vs `admin`), see [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md).

---

## 1. Production env before build

`NEXT_PUBLIC_*` values are **baked in at build time**. Create `.env.production.local` (gitignored) or set vars in the shell **before** `npm run build`:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
APEX_HOST=yourdomain.com
ADMIN_HOST=admin.yourdomain.com

# Optional but recommended if used in client bundles:
# NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
# NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
# NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
```

Runtime-only secrets (Mongo, auth, Cloudinary, EmailJS private key, etc.) go in **cPanel** after upload — not required for the build to succeed.

---

## 2. Build locally

```bash
npm ci
npm run build
```

Confirm these exist:

- `.next/standalone/server.js`
- `.next/standalone/.next/` (server build output)
- `.next/static/` (browser assets)

---

## 3. Assemble the deploy folder

From the **project root**:

| Copy from | Paste into |
|-----------|------------|
| `public/` (entire folder) | `.next/standalone/public/` |
| `.next/static/` (entire folder) | `.next/standalone/.next/static/` |

Your runnable app lives in **`.next/standalone/`**:

```text
.next/standalone/
├── server.js          ← cPanel startup file
├── package.json
├── node_modules/      ← traced production deps only (small)
├── .next/
│   └── static/        ← you copied this
└── public/            ← you copied this
```

**Zip the contents** of `.next/standalone/` (select all files inside, not the parent `.next` folder). Name it e.g. `xon-standalone.zip`.

---

## 4. Upload to GO54 / cPanel

1. Extract the zip into the Node application root (e.g. `~/xon` or the path cPanel shows).
2. **Setup Node.js App**
   - Node **20.x**
   - Application root = folder where `server.js` was extracted
   - **Application startup file:** `server.js`
   - **Run script:** `node server.js` (or cPanel’s equivalent with `NODE_ENV=production`)

---

## 5. cPanel environment variables (runtime)

```bash
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=400
# PORT — usually set by cPanel; do not override unless docs say so

APEX_HOST=yourdomain.com
ADMIN_HOST=admin.yourdomain.com

MONGODB_URI=...
MONGODB_DB_NAME=xon
AUTH_SECRET=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

WHATSAPP_NUMBER=...
CONTACT_PHONE=...
CONTACT_EMAIL=...
CONTACT_LOCATION=...

NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...

ADMIN_OTP_EMAIL=...
EMAILJS_OTP_TEMPLATE_ID=...
EMAILJS_PRIVATE_KEY=...
```

`NEXT_PUBLIC_SITE_URL` should already match production if you set it before build. If you change domain later, **rebuild** and re-upload.

Restart the Node app after saving env vars.

---

## 6. DNS (same as full deploy)

| Host | Purpose |
|------|---------|
| `yourdomain.com` / `www` | Public site |
| `admin.yourdomain.com` | Admin panel (`/login`, `/products`, …) |

Both point to the **same** Node app. Middleware uses `Host` to route.

---

## 7. Smoke tests

| URL | Expected |
|-----|----------|
| `https://yourdomain.com/` | Home |
| `https://yourdomain.com/products` | Catalog |
| `https://yourdomain.com/admin` | **404** |
| `https://yourdomain.com/googleaeb31cdd9158e395.html` | Google verification |
| `https://yourdomain.com/sitemap.xml` | Sitemap with your domain |
| `https://admin.yourdomain.com/login` | Admin login |

---

## 8. Updates (new release)

1. Pull latest code locally.
2. Set production `NEXT_PUBLIC_*` / host vars.
3. `npm ci && npm run build`
4. Copy `public/` and `.next/static/` into `.next/standalone/` again.
5. Zip standalone contents → upload → extract (overwrite) → restart Node.

---

## Local development (unchanged)

```bash
npm run dev
```

Uses the root `server.js` in development. Standalone output is for **production upload only**.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| 502 / app won’t start | Wrong app root, `PORT` mismatch, or Node not restarted |
| CSS/JS 404, broken styling | Forgot to copy `.next/static` into `standalone/.next/static` |
| Images/fonts 404 | Forgot to copy `public/` into `standalone/public/` |
| SEO links show `localhost` | Rebuild with correct `NEXT_PUBLIC_SITE_URL` |
| Admin on apex works | Set `APEX_HOST` and `ADMIN_HOST` in cPanel |
| Build fails on PC | Fix errors locally; don’t upload partial `.next` |
| Runtime error after Windows build | Rebuild on **WSL** (Linux) and re-upload |

---

## vs full-repo deploy

| | Standalone (this doc) | Upload source + build on server |
|--|----------------------|----------------------------------|
| Upload size | Small (~20–80 MB) | Source only, but server runs heavy build |
| Server RAM during deploy | Low | High (`npm run build`) |
| GO54 1 GB | **Recommended** | Risky |
