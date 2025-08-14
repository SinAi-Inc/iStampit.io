# iStampit Web (Prototype)

Browser-based OpenTimestamps verification demo. Authentication (Google OAuth via NextAuth) now lives exclusively in the separate `istampit-auth` service; this web app only consumes the remote session endpoint and no longer needs Google OAuth env vars.

## Features

- Upload a file OR paste its SHA-256.
- Load a `.ots` detached timestamp file.
- Best-effort verify & display status: `pending` | `complete` | `mismatch` | `error`.
- Show calendar URLs (if present) and Bitcoin block height/time if a block attestation is embedded.

## Limitations

- Full upgrading/verification may require contacting calendar servers and (for completeness) validating Bitcoin headers; this prototype performs only client-side parsing and heuristic attestation extraction.
- Block height/time extraction is best-effort; underlying library APIs may evolve.

## Next Steps

- Implement active upgrade calls to calendars.
- Render full attestation tree.
- Provide copyable JSON summary.

License: MIT (web UI). Underlying `opentimestamps` library retains its original license.

## Deployment Modes

This project supports two distinct deployment targets:

### 1. Dynamic (Vercel or any Node runtime)

- `STATIC_EXPORT` unset.
- Full NextAuth `/api/auth/*` routes available (pages directory).
- Auth UI (`AuthBadge`, remote session polling) is active.
- Environment may set `NEXT_PUBLIC_AUTH_ORIGIN` if auth is hosted on a different domain (optional).

### 2. Pure Static (GitHub Pages)

- Workflow sets `STATIC_EXPORT=1` and `NEXT_PUBLIC_PAGES_STATIC=1`.
- Auth-related UI & network calls are gated off to avoid 404 spam (no API routes exist on Pages).
- `NEXT_PUBLIC_AUTH_ORIGIN` intentionally omitted to prevent cross-origin fetch attempts.
- Users see no auth badge (optional fallback text can be enabled – see below).

### Environment Flags

- `STATIC_EXPORT`: In `next.config.js` triggers `output: 'export'` for static HTML export.
- `NEXT_PUBLIC_PAGES_STATIC`: Public runtime flag used in components/hooks to disable authentication logic entirely in static builds.
- `NEXT_PUBLIC_AUTH_ORIGIN`: Optional remote auth base (e.g. `https://auth.example.com`). Leave blank for same-origin or static builds with auth disabled.

## Optional Auth Fallback UI

If you wish to show a placeholder instead of hiding auth completely in static mode, set `SHOW_STATIC_AUTH_FALLBACK=1` (or adapt logic) and render a small badge like:

```tsx
{process.env.NEXT_PUBLIC_PAGES_STATIC === '1' && (
	<span className="text-xs text-gray-500">Auth disabled in static preview</span>
)}
```

This keeps production Pages clean while informing users why sign-in is absent.

