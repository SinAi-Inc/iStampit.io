# iStampit CLI — Proof-of-Existence helper (OpenTimestamps)

![CodeQL](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/codeql.yml/badge.svg)
![Scorecard](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/scorecard.yml/badge.svg)

Thin CLI for hashing files, calling the OpenTimestamps client behind the scenes, and managing `.ots` receipts (stamp, verify, upgrade, info).

> Status: **Alpha.** APIs, CLI flags, and proof formats may change before v1.0. Use at your own risk. Releases are signed (Cosign keyless) with SLSA v3 provenance. See `../SECURITY.md` for verification steps.

## Install

```bash
pip install istampit-cli  # (once published) or pipx install istampit-cli
```

## Usage

```bash
istampit stamp path/to/file.pdf          # creates file.pdf.ots
istampit verify path/to/file.pdf.ots     # verifies (uses cache/calendars)
istampit upgrade path/to/file.pdf.ots    # fetches attestations, writes upgraded proof
istampit info path/to/file.pdf.ots       # shows operations/attestations
```

Add `--json` for structured output.

## Exit Codes

- 0 success
- non‑zero failure (error already printed)

## License

MIT for wrapper code. OpenTimestamps libs under LGPL-3.0.
