# Documentation Organization

All non-README project documentation has been consolidated under this `docs/` directory for easier discovery.

## Moved root documents

Moved from repo root (root now contains lightweight pointers for GitHub discovery):

- CODE_OF_CONDUCT.md
- CONTRIBUTING.md
- COOKIE_POLICY.md
- HOSTING.md
- PROJECT_STATUS.md
- RELEASE.md
- SECURITY_NOTES.md
- SECURITY.md (root pointer kept for security scanners)
- PRODUCTION-TEST-COMPLETE.md
- LEGAL_PAGES_IMPLEMENTATION.md
- MOBILE_MENU_BLUR_ENHANCEMENTS.md
- NAVIGATION_IMPROVEMENTS.md

Service / package specific docs should live alongside their code (e.g., each package's README). Cross-cutting or policy docs belong here.

## Conventions

- Use UPPER_SNAKE for policy/legal docs (e.g., SECURITY.md)
- Use kebab-case for guides/tutorials (e.g., architecture-overview.md)
- Prefer linking relatively (../README.md) when referencing root README.

## Next steps (optional)

1. Add architecture-overview.md consolidating diagrams.
2. Add threat-model.md summarizing security boundaries.
3. Generate API docs into docs/api/ from source comments.

