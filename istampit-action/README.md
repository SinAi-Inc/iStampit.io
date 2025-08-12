# iStampit GitHub Action — Stamp your releases & artifacts

![Release Sign](https://github.com/SinAi-Inc/istampit-io/actions/workflows/release-sign.yml/badge.svg)
![Verify Security Artifacts](https://github.com/SinAi-Inc/istampit-io/actions/workflows/verify-security-artifacts.yml/badge.svg)

Composite Action that:

> Status: **Alpha.** Action inputs and output behaviors may evolve before v1.0. Signed releases + provenance: see root `SECURITY.md` for verification guidance.

1. Installs the OpenTimestamps client
2. Hashes target files
3. Produces `.ots` receipts and uploads them as workflow artifacts or release assets

## Usage

```yaml
- uses: SinAi-Inc/istampit-action@v0.1.0
  with:
    paths: "dist/**/*"
    upgrade: "true"
```

See `.github/workflows/example.yml` for a full workflow example.

## Inputs

- `paths` (required) comma-separated glob(s)
- `upgrade` (optional, default false) attempt calendar upgrade

## License

MIT (action code). OTS client under LGPL-3.0.
