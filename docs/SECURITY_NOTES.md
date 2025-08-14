# (Moved) Security Notes

Canonical maintained copy. Original root file replaced with pointer.

````markdown
# Security Notes (August 2025)

This document supplements SECURITY.md with current dependency vulnerability status, mitigations, and planned remediation actions.

## Current Status Summary

| Area | Status | Notes |
|------|--------|-------|
| Critical runtime vulns | Mitigated | Next.js upgraded to 14.2.31 (auth bypass, cache poisoning, DoS patched) |
| Remaining critical (form-data boundary) | Contained | Only via deprecated `request` in transitive `opentimestamps`; not used for outbound network calls client-side |
| High (request / SSRF, cache poisoning variants) | Contained | Same deprecated stack – no dynamic user-controlled outbound requests in current architecture |
| Dev-only vulns (tar-fs, ws, tmp) | In progress | Upgrading @lhci/cli to latest reduces exposure |
| Moderate (tough-cookie 2.x proto pollution) | Contained | Legacy chain; will be eliminated with `opentimestamps` refactor |
| esbuild dev server exposure | Low impact | Next dev binds locally; no untrusted network exposure in CI/CD |

## Threat Surface Notes

1. **Static Export Frontend** – Production is a static bundle; no Next.js server runtime routes or API handlers. Many Next.js server-specific advisories have reduced or null impact.
2. **No Server File Handling** – Files are hashed locally in-browser; no server upload endpoints -> eliminates typical SSRF / path traversal vectors.
3. **Outbound Network Calls** – Verification currently does NOT perform dynamic outbound calendar aggregation in-browser (calendars list static). Deprecated `request` chain is effectively dormant.
4. **Iframe Embed Security** – Origin allowlist enforced via `deriveAllowedOrigin`; no wildcard postMessage; limits XSS pivot risk.

## Mitigation Actions Completed

- Upgraded `next` & `eslint-config-next` to 14.2.31.
- Added bundle analyzer & content-visibility optimizations without widening attack surface.
- CSP hashes generated for inline GA snippets (avoids `'unsafe-inline'` for scripts once styling is refactored).
- Navigation refactored to server + minimal client island (reduces client JS attack surface).

## Planned Remediation (Tracking)

| ID | Action | Priority | Target | Owner | Notes |
|----|--------|----------|--------|-------|-------|
| SEC-OT-001 | Replace `opentimestamps` dependency (remove `request` / `request-promise`) | High | v1.1 | Core | Fork or WASM minimalist verify lib |
| SEC-DEV-002 | Upgrade @lhci/cli & related dev deps | Medium | Now | DevEx | Reduces tar-fs/ws/tmp advisories |
| SEC-BLD-003 | Remove residual `'unsafe-inline'` for styles (adopt hashed or CSP-safe Tailwind) | Medium | v1.1 | Frontend | Evaluate Tailwind JIT + nonce strategy |
| SEC-OPS-004 | Add automated dependency diff & advisory gating in CI | Medium | v1.1 | DevSecOps | Fails build on new criticals |
| SEC-DOC-005 | Publish fork hardening rationale (supply chain transparency) | Low | Post-fork | Docs | SECURITY_NOTES update |

## Opentimestamps Fork Strategy (SEC-OT-001)

Phases:

1. Inventory usage: Only dynamic import in `OtsVerifier`. Needed functions: receipt parse, proof verification, Bitcoin Merkle path validation, calendar URLs (static).
2. Create `packages/ots-lite` (MIT) with:
   - Minimal TypeScript parser for .ots structure (subset: Ops, Timestamp, Attestations).
   - SHA-256 & Merkle tree ops using Web Crypto (browser) / Node crypto.subtle.
   - Verification pipeline: load receipt bytes -> parse -> verify -> produce result object consumed by UI.
   - No network fetch (initial); optional enhancement later using `fetch` (no `request`).
3. Replace dynamic `import('opentimestamps')` with local module.
4. Add test vectors (sample .ots receipts) to ensure parity.
5. Security review: confirm absence of dynamic eval, FS, or legacy transitive packages.
6. Deprecate external lib: remove from dependencies; update docs & LICENSE attribution.

Fallback: If full reimplementation is heavy, short-term fork `opentimestamps` repo:

- Strip `request(-promise)` usage; substitute `fetch` / `undici` only where needed.
- Bump dependencies: `form-data` → 4.x, `tough-cookie` → 5.x.
- Publish scoped package `@istampit/opentimestamps-lite`.

## Residual Risk Assessment

- Remaining advisories limited to dormant code paths or dev-tooling; risk accepted temporarily with clear remediation timeline (<= v1.1).
- Continuous monitoring via Dependabot and CI gate (to be added) reduces window of exposure.

## Next Immediate Steps

1. Complete @lhci/cli upgrade & re-run build/tests.
2. Open tracking issue (SEC-OT-001) in repo (placeholder added to PROJECT_STATUS once issue number exists).
3. Prototype receipt parser (spike) – measure LOC & complexity.

---
Last updated: August 12, 2025

````
