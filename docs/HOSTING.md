# Hosting

The project is now a fully static export with no separate auth service. All prior reverse proxy requirements for `auth.istampit.io` are obsolete and intentionally removed to simplify deployment.

## Current Requirements

1. Serve the contents of `istampit-web/out` at your chosen domain.
2. Set a cache policy that allows immutable assets to be cached (e.g. `_next/static/**`) and short TTL (or no cache) for JSON ledger files (`/ledger/**`).
3. Optional: add a basic Content-Security-Policy, e.g.:

```text
default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'self';
```

## Legacy (Removed)

Sections referring to `/api/auth/*`, `/api/session`, CORS allow‑lists, or `istampit-auth` have been removed. If re‑introducing auth later, resurrect the historical version from git history.
