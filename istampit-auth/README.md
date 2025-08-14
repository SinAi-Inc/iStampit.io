# iStampit Auth

[![Deploy - Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

Minimal Next.js app providing authentication (Google OAuth via NextAuth) for iStampit.

## Architecture (Popup OAuth)

This service runs at `auth.istampit.io` and issues a cross‑subdomain session cookie (`__Host-istampit-session`) with:

```text
HttpOnly; Secure; SameSite=None; Domain=.istampit.io; Path=/
```

Flow:

1. Static frontend (istampit.io) opens popup to `/api/auth/signin/google?callbackUrl=/dashboard`.
2. After provider redirect, `redirect` callback sends browser to `/finish?callback=/dashboard`.
3. `/finish` posts `auth:complete` to opener (validated origin) and closes; opener refetches `/api/session`.
4. Frontend updates UI without full navigation.

Add providers by uncommenting and configuring in `lib/authOptions.ts`.

## Environment Variables

Set the following in Vercel Project Settings:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- NEXTAUTH_SECRET (generate: `openssl rand -base64 32`)
- NEXTAUTH_URL (e.g. <https://auth.istampit.io>)

## Local Development

```bash
npm install
npm run dev
```

Visit <http://localhost:3001>

## Deployment

Deploy this `istampit-auth` directory to Vercel. Configure custom domain `auth.istampit.io` pointing to the Vercel project.

## Notes

This app intentionally has no static export and no marketing pages.

## API

| Route | Purpose |
|-------|---------|
| `/api/auth/[...nextauth]` | NextAuth handlers (sign-in, callback, session) |
| `/api/session` | Lightweight JSON `{ authenticated: boolean, user? }` for cross-origin fetch |
| `/api/health` | Liveness probe returning `{ status, ts }` |

## CORS

All `/api/*` routes send CORS headers for an allow‑list of origins with credentials enabled. Update `ALLOWED` in `middleware.ts` to change.

Allowed (default):

```text
https://istampit.io
https://www.istampit.io
http://localhost:3000
http://localhost:3002
```

The session cookie is scoped to `.istampit.io` in production so subdomains share auth.

## Rate Limiting

Best-effort in-memory limit: 60 requests / minute / IP for `/api/*` (enforced in middleware). Returns 429 + `Retry-After: 60` when exceeded. Suitable for lightweight abuse mitigation; upgrade to durable store (KV/Upstash/Redis) for stronger guarantees.

## Security Headers

Middleware adds:

- `Strict-Transport-Security: max-age=15552000; includeSubDomains; preload`
- CORS headers only for allow‑listed origins (no wildcard with credentials).

Add additional headers (CSP, Permissions-Policy) at the platform level as needed.
