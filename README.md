<!-- Consolidated title -->
# iStampit.io — Innovation Timestamping & Public Ledger

 [![CI](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/ci.yml/badge.svg)](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/ci.yml)
 [![Pages](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/pages.yml/badge.svg)](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/pages.yml)
![CLI CI](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/cli.yml/badge.svg)
![CodeQL](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/codeql.yml/badge.svg)
![Scorecard](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/scorecard.yml/badge.svg)
![Release Sign](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/release-sign.yml/badge.svg)
![Verify Security Artifacts](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/verify-security-artifacts.yml/badge.svg)

![Project preview](https://github.com/user-attachments/assets/977c8aa8-488b-4739-a2e4-c6c3997f5adf)


**Mission:** Verifiable proof-of-existence for research & creative artifacts using the OpenTimestamps (OTS) protocol on Bitcoin, plus a public **Innovation Ledger** and an embeddable **Verify** widget for third-party sites.

> Status: **Alpha.** APIs, CLI flags, and proof formats may change before v1.0. Use at your own risk. All releases are signed with Sigstore Cosign (keyless) and include SLSA v3 provenance. See `SECURITY.md` for how to verify signatures and provenance.

## Hosting Model

The application now runs in a **hybrid Next.js deployment**: static pages + live API routes (`/api/stamp`, `/api/session`) and middleware. This enables real-time stamping (spawning the `istampit` CLI) while keeping most pages cached statically.

Key points:

- `/api/stamp` requires a Node/Edge environment that allows spawning a subprocess (CLI) or executing child processes. (Standard Vercel Node serverless functions are acceptable; pure static hosts are not.)
- Rate limiting defaults to in-memory; production deployments should configure Redis (set `ENABLE_REDIS=1` and `REDIS_URL` / `UPSTASH_REDIS_REST_URL`).
- If deploying to Vercel: add the Python-based CLI to the build (either pre-install via `pip` in a build step or bundle a JS wrapper). Ensure the `istampit` executable is on `PATH` at runtime.
- For container-based hosts (Fly.io, Render, Docker/Kubernetes): install the CLI in the image and expose port 3000 running `next start`.
- Fallback static-only mode (former configuration) is no longer default; to disable runtime stamping remove or stub the `/api/stamp` route.

See Hosting Notes below for operational guidance.

### Hosting Notes

| Capability | Requirement | Notes |
|------------|-------------|-------|
| Child process (CLI) | Required | Used to invoke `istampit` for hashing/stamping. |
| Environment Variables | Optional/Recommended | `ENABLE_REDIS`, `REDIS_URL` / `UPSTASH_REDIS_REST_URL`, `NEXTAUTH_URL` (if session proxy used). |
| Redis (optional) | Improves rate limiting | Without it, in-memory limiter resets on cold start. |
| Node Version | 20.x | Enforced via `engines` field; avoids runtime drift. |
| Build Artifacts | `next build` output | Serve with `next start` (not `next export`). |
| Security | Least privilege | If using Redis, scope credentials to rate limiting only. |

Deployment checklist:

1. Install dependencies + `istampit` CLI (Python virtual env or standalone binary) during build.
2. Ensure `NODE_ENV=production` and Node 20.x runtime.
3. (Optional) Provide Redis URL + set `ENABLE_REDIS=1`.
4. Run `npm run build` then launch with `npx next start` (or process manager).
5. Monitor `/api/stamp` latency and memory; tune rate limits if necessary.

If a platform forbids spawning processes, consider a lightweight microservice for stamping and adjust the frontend to call that endpoint.


<!-- Removed duplicate H1 and repeated badges/mission paragraph -->

## What's New in v1.0

✅ **Innovation Ledger**: Public registry of stamped artifacts with status tracking
✅ **Embed Widget**: One-line script for third-party verification
✅ **Automated Stamping**: Daily GitHub Actions workflow for continuous innovation proof
✅ **Enhanced Security**: Cosign signatures, SLSA provenance, and security scanning
✅ **Mobile-First Design**: Responsive UI with accessibility standards

## Features

### Verification System

- **Web Interface**: Drop `.ots` receipt + original file → instant verification
- **Hash-Only Mode**: Verify using SHA-256 hash when files are sensitive
- **Status Tracking**: Real-time Bitcoin confirmation status
- **Error Handling**: Clear messaging for invalid or incomplete proofs

### Innovation Ledger

- **Public Registry**: Transparent log of all stamped innovations
- **Filtering & Search**: Find entries by status, date, or content type
- **Copy Functions**: Easy sharing of hashes and transaction IDs
- **Privacy First**: Only hashes stored, never file contents
- **Statistics Dashboard**: Track confirmed vs pending stamps

### Embed Widget

Drop-in verification for any website:

```html
<script src="https://istampit.io/widget/v1.js" async></script>
<div data-istampit-verify data-mode="inline" data-theme="light"></div>
```

**Features:**

- **Inline Mode**: Direct embedding with auto-resize
- **Modal Mode**: Click-to-open overlay with focus management
- **Theme Support**: Light/dark modes with custom styling
- **Event Communication**: PostMessage API for verification results
- **Security**: Sandboxed iframe prevents XSS attacks

### Automation & Infrastructure

- **Daily Stamping**: Automated workflow stamps repository state
- **CI/CD Pipeline**: Comprehensive testing and deployment
- **Static Export**: CDN-ready deployment with global distribution
- **Type Safety**: Full TypeScript coverage with strict typing

### Hash Stamping API (Experimental)

Client-side UX calls a lightweight stamping endpoint to obtain an OpenTimestamps receipt from a precomputed SHA-256 hash (your file never uploads):

POST `/api/stamp`

Request body:

```json
{ "hash": "<64 hex sha256>" }
```

Successful response:

```json
{
  "hash": "abcd...",            // normalized lowercase hash
  "filename": "abcd....ots",     // suggested receipt filename
  "size": 1234,                   // bytes
  "receiptB64": "BASE64..."      // binary .ots file encoded in base64
}
```

Errors return HTTP 4xx/5xx with `{ "error": "code" }` (e.g. `invalid_hash`, `rate_limited`, `stamp_failed`).

GET `/api/stamp/{hash}.ots`

Streaming binary receipt download for the given hash. Same rate limits as POST. Returns `application/octet-stream` with `Content-Disposition: attachment`.

Rate limiting: sliding window (60/min, max 15 / 10s burst) per IP (in-memory demo implementation). For production deploy, back with Redis / durable KV and tighten thresholds.

## Architecture

```text
repo-root/
├── istampit-web/             # Web frontend (Next.js static export)
│   ├── app/                  # App Router routes (verify, ledger, embed, etc.)
│   ├── components/           # UI components
│   ├── public/widget/        # Embed widget bundle(s)
│   └── types/                # Shared TS types
├── istampit-cli/             # Python CLI (packaging + src + tests)
├── istampit-action/          # GitHub Action for automated stamping
├── artifacts/                # Daily stamped artifacts + OTS receipts
├── docs/                     # Centralized documentation (policies, guides, status)
├── ledger.json               # Innovation ledger data
├── ledger-entry.schema.json  # JSON Schema for ledger entries
└── scripts/                  # Utility / verification scripts
```

## Documentation Index

All non-README docs have been consolidated under `docs/`.

Key documents:

- Security: [`docs/SECURITY.md`](./docs/SECURITY.md) / [`docs/SECURITY_NOTES.md`](./docs/SECURITY_NOTES.md)
- Policies: [`docs/CODE_OF_CONDUCT.md`](./docs/CODE_OF_CONDUCT.md), [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md), [`docs/COOKIE_POLICY.md`](./docs/COOKIE_POLICY.md)
- Operations: [`docs/HOSTING.md`](./docs/HOSTING.md), [`docs/RELEASE.md`](./docs/RELEASE.md)
- Status & Releases: [`docs/PROJECT_STATUS.md`](./docs/PROJECT_STATUS.md), [`docs/PRODUCTION-TEST-COMPLETE.md`](./docs/PRODUCTION-TEST-COMPLETE.md)
- Security Deep Dive: [`docs/SECURITY_NOTES.md`](./docs/SECURITY_NOTES.md)
- UX / Implementation Notes: [`docs/NAVIGATION_IMPROVEMENTS.md`](./docs/NAVIGATION_IMPROVEMENTS.md), [`docs/MOBILE_MENU_BLUR_ENHANCEMENTS.md`](./docs/MOBILE_MENU_BLUR_ENHANCEMENTS.md), [`docs/LEGAL_PAGES_IMPLEMENTATION.md`](./docs/LEGAL_PAGES_IMPLEMENTATION.md)

See `docs/ORGANIZATION.md` for migration rationale.

## Quick Start

### Development Setup

```bash
# Prerequisites: Node.js 20+, npm 10+
git clone https://github.com/SinAi-Inc/iStampit.io.git
cd iStampit.io/istampit-web

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:3000

# Run tests
npm test

# Build for production
npm run build
npm run export
```

### Using the Embed Widget

#### Basic Integration

```html
<script src="https://istampit.io/widget/v1.js" async></script>
<div data-istampit-verify data-mode="inline" data-theme="light"></div>
```

#### Modal Mode

```html
<div data-istampit-verify data-mode="modal" data-theme="dark">
  <button>🔍 Verify with iStampit</button>
</div>
```

#### Listen for Results

```javascript
window.addEventListener('istampit-verified', (event) => {
  const {status, txid, blockHeight, hash} = event.detail;
  console.log(`Verification ${status}:`, {txid, blockHeight});
});
```

## Security & Verification

### Release Verification (Cosign)

All releases are signed using Sigstore Cosign in keyless mode:

```bash
# Verify release artifact
cosign verify-blob ./artifact.tar.gz \
  --bundle ./artifact.tar.gz.bundle \
  --certificate-identity-regexp '^https://github.com/SinAi-Inc/iStampit.io/\\.github/workflows/release-sign\\.yml@refs/tags/v[0-9]+\\.[0-9]+\\.[0-9]+$' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

### Security Features

- **Sandboxed Widgets**: iframe isolation prevents XSS
- **Content Security Policy**: Strict CSP headers in production
- **Input Validation**: All user inputs sanitized and validated
- **No File Storage**: Only cryptographic hashes processed
- **Audit Trail**: All operations logged for transparency

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Verification**: OpenTimestamps JavaScript library
- **Deployment**: Static export with CDN distribution
- **CI/CD**: GitHub Actions with automated testing
- **Security**: Cosign signatures, SLSA provenance, CodeQL scanning

## Contributing

We welcome contributions! Please see:

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) - Development guidelines
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) - Community standards
- [`SECURITY.md`](./SECURITY.md) - Security policy and reporting

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Run tests: `npm test`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push branch: `git push origin feature/amazing-feature`
6. Open Pull Request

## License & Attribution

- **Code**: MIT License - see [`LICENSE`](./LICENSE)
- **OpenTimestamps**: Uses LGPL-licensed libraries
- **Dependencies**: See individual package licenses

---

Made with ❤️ for the global innovation community

*Empowering creators, researchers, and innovators with cryptographic proof of their work since 2024.*

### Ledger Data

The build produces both an aggregated ledger JSON and per‑month segment files for efficient loading:

- `public/ledger/index.json` – full aggregated ledger (legacy path, kept for compatibility)
- `public/ledger/YYYY/MM/index.json` – month-specific slices generated at build time

Generation happens automatically via the `prebuild` script (invoked before `next build`). You can run it explicitly:

```bash
cd istampit-web
npm run prebuild
```

Source scripts:

- `scripts/prebuild.mjs` – cleans `.next/` and `out/`, then triggers generation
- `scripts/generate-ledger.mjs` – splits `../../ledger.json` into monthly JSON outputs

This approach keeps the static bundle lean as the ledger grows while preserving a single file endpoint for existing consumers.

<!-- Stack section folded into Tech Stack earlier; removed duplicate -->

## Client Libraries

- **JS OTS lib:** `opentimestamps` (NPM) for in-browser operations.

> Workflows use a fallback expression: `${{ secrets.SUBMODULES_TOKEN || github.token }}` so they still function if the PAT is absent (for public repos).

## Verifying Release Artifacts & Receipts (Cosign Keyless)

After a published release, artifacts (CLI wheels/tarballs and any *.ots receipts) are signed using Sigstore Cosign in keyless mode. Each signed file has a corresponding `.bundle` containing signature + certificate.

Example: verify a sample file (replace path as needed):

```bash
cosign verify-blob ./sample.txt \
  --bundle ./sample.txt.bundle \
  --certificate-identity-regexp '^https://github.com/SinAi-Inc/iStampit.io/\\.github/workflows/release-sign\\.yml@refs/tags/v[0-9]+\\.[0-9]+\\.[0-9]+$' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

Successful verification proves the file originated from a GitHub Actions workflow in this repository at the time of signing.
