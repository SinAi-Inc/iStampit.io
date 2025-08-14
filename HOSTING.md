# Hosting Configuration (Static Marketing Site)

Because the marketing site uses `output: 'export'`, Next.js build-time `redirects()` are not applied at runtime and API routes / middleware are stripped. To integrate with the centralized auth service (`auth.istampit.io`) you must configure the hosting layer (CDN / reverse proxy) with the following rules.

## Required Rewrites / Proxies

1. `/api/auth/*` -> `https://auth.istampit.io/api/auth/$1` (HTTP 307 or transparent proxy). Must forward:
   - Method & body
   - `Cookie` header (browser supplied)
   - Response `Set-Cookie` back to client
2. `/api/session` -> `https://auth.istampit.io/api/session`
   - Allow credentials (CORS) if performing cross-origin fetch; or proxy same-origin.

If hosting at `sinai.eihdah.com` (temporary domain): adjust allowed opener origins list in `istampit-auth/app/finish/page.tsx` and CORS allow‑list in auth middleware to include `https://sinai.eihdah.com`.

## Example (nginx)

```nginx
location /api/auth/ { proxy_pass https://auth.istampit.io/api/auth/; proxy_set_header Host auth.istampit.io; proxy_cookie_domain auth.istampit.io .istampit.io; }
location = /api/session { proxy_pass https://auth.istampit.io/api/session; proxy_set_header Host auth.istampit.io; }
```

## Example (Cloudflare Workers)

```js
export default {
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/auth/')) {
      url.hostname = 'auth.istampit.io';
      return fetch(new Request('https://auth.istampit.io' + url.pathname + url.search, req));
    }
    if (url.pathname === '/api/session') {
      url.hostname = 'auth.istampit.io';
      return fetch(new Request('https://auth.istampit.io/api/session' + url.search, req));
    }
    return fetch(req);
  }
};
```

## Environment Validation

`npm run build` runs `scripts/validate-env.cjs` and fails if `NEXT_PUBLIC_AUTH_ORIGIN` mismatches the expected production origin. Override (CI only) by setting `ALLOW_UNSAFE_ENV=1` (extend script if needed).

## Updating Allowed Origins

When adding a new marketing host, update:

1. `istampit-auth/middleware.ts` CORS allow‑list (if present)
2. `ALLOWED_OPENERS` in `istampit-auth/app/finish/page.tsx`
3. Deployment layer rewrites above

## Session Fetch Strategy

Frontend code fetches `${AUTH_ORIGIN}/api/session` directly with `credentials: include`. If you proxy `/api/session` same-origin, you may change fetch target to `/api/session` for stricter CSP.

## Security Notes

- Use HTTPS only; ensure HSTS preload on primary domain.
- Forward `Set-Cookie` header intact (do not strip `Secure`, `SameSite=None`).
- Deny caching for auth proxied routes.
- Add (or extend) a Content-Security-Policy header. Minimum recommendation:
  - `default-src 'self';`
  - `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;` (adjust if removing inline)
  - `connect-src 'self' https://auth.istampit.io;`
  - `img-src 'self' data: https:;`
  - `frame-ancestors 'self';` (if embeds required, scope to specific partner domains)
  - `upgrade-insecure-requests;`

For proxy endpoints (`/api/auth/*`, `/api/session`), ensure CSP does not block `connect-src` to `https://auth.istampit.io` when not proxied, or simply allow `'self'` if fully proxied same-origin.
