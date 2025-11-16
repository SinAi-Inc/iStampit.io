# Changelog

All notable changes in this monorepo (action, CLI, web) are summarized here. The format loosely follows Keep a Changelog and Semantic Versioning.

## [v1.0.3] - 2025-08-17

### Added

- Detached hash stamping GA via `istampit-cli` v1.0.3 (`stamp --hash <sha256>` + optional `--upgrade`).
- Structured JSON output for hash mode (includes `hash`, `upgraded`).
- Web `/api/stamp` endpoint (hash → receipt) with in-memory rate limiting & auto‑download integration on verify page.

### Security / Infra

- Workflow: CLI hash stamp smoke test.

### Notes

- Future: provenance (SLSA) workflow & consolidated permissions hardening.

[v1.0.3]: https://github.com/SinAi-Inc/iStampit.io/releases/tag/v1.0.3
