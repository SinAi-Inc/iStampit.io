# Security Policy

## Supported Versions

The project is pre-1.0; the latest tagged release on `main` is the only supported version. Security fixes will be released as patch versions (e.g. v0.1.x) as needed.

## Reporting a Vulnerability

Please **do not file public issues for security vulnerabilities.**

Instead, email: <istampit@eihdah.com> with:

1. Description of the issue and potential impact
2. Steps to reproduce (proof of concept if possible)
3. Affected version / commit (output of `git rev-parse HEAD`)
4. Your recommended remediation (if any)

You will receive an acknowledgement within 3 business days. We aim to provide an initial remediation or mitigation plan within 14 days.

## Coordinated Disclosure

If the issue has real-world exploitation potential, we request a 30 day embargo (extendable by mutual agreement) prior to public disclosure.

## Cryptographic Integrity

Release artifacts and OpenTimestamps receipts are signed using **Sigstore Cosign keyless** workflows. Verify with:

```bash
cosign verify-blob <artifact> \
  --bundle <artifact>.bundle \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  --certificate-identity-regexp '^https://github.com/SinAi-Inc/iStampit.io/\\.github/workflows/release-sign\\.yml@refs/tags/v[0-9]+\\.[0-9]+\\.[0-9]+$'
```

## Dependencies & Licenses

Primary third-party components:
- `opentimestamps-client` (LGPL-3.0-or-later) – used as an external dependency; we do not redistribute modified copies. See its license for details.

## Preferred Keyless Trust Model

We currently do not distribute PGP keys. Sigstore certificates + provenance (SLSA) serve as the chain of custody.

## Scope

Repos covered: istampit-web, istampit-cli, istampit-action (monorepo directories).

---

Thank you for helping keep iStampit users safe.
