# iStampit (Web) — Innovation Timestamping & Public Ledger

![CodeQL](https://github.com/SinAi-Inc/istampit-io/actions/workflows/codeql.yml/badge.svg)
![Scorecard](https://github.com/SinAi-Inc/istampit-io/actions/workflows/scorecard.yml/badge.svg)
![Release Sign](https://github.com/SinAi-Inc/istampit-io/actions/workflows/release-sign.yml/badge.svg)
![Verify Security Artifacts](https://github.com/SinAi-Inc/istampit-io/actions/workflows/verify-security-artifacts.yml/badge.svg)

**Mission:** Verifiable proof-of-existence for research & creative artifacts using the OpenTimestamps (OTS) protocol on Bitcoin, plus a public **Innovation Ledger** and an embeddable **Verify** widget for third-party sites.

> Status: **Alpha.** APIs, CLI flags, and proof formats may change before v1.0. Use at your own risk. All releases are signed with Sigstore Cosign (keyless) and include SLSA v3 provenance. See `SECURITY.md` for how to verify signatures and provenance.

## What’s here (Prototype)

- **Verify page:** Drop a `.ots` receipt + original file (or just its SHA-256) → browser verifies via OTS JS lib and shows status.
- **Innovation Ledger:** Public list of stamped artifacts (title, hash, proof link, attestation status/time).
- **Embed widget:** `<script>` you can paste on partner sites to expose “Verify with iStampit”.

> OTS provides client libs in Python/JS and proofs can be verified independently; full verification typically requires access to Bitcoin chain data once finalized.

## Stack

- **Next.js + TypeScript + Tailwind** (static export OK)
- **JS OTS lib:** `opentimestamps` (NPM) for in-browser operations.

## Quick Start

```bash
# Node 20+ recommended
npm install
npm run dev
```

## Verifying Release Artifacts & Receipts (Cosign Keyless)

After a published release, artifacts (CLI wheels/tarballs and any *.ots receipts) are signed using Sigstore Cosign in keyless mode. Each signed file has a corresponding `.bundle` containing signature + certificate.

Example: verify a sample file (replace path as needed):

```bash
cosign verify-blob ./sample.txt \
  --bundle ./sample.txt.bundle \
  --certificate-identity-regexp '^https://github.com/SinAi-Inc/istampit-io/\\.github/workflows/release-sign\\.yml@refs/tags/v[0-9]+\\.[0-9]+\\.[0-9]+$' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

Successful verification proves the file originated from a GitHub Actions workflow in this repository at the time of signing.
