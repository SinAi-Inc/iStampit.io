# iStampit Retirement Runbook

## Status

iStampit entered retirement in May 2026. The public website is being reduced to a goodbye landing page while the remaining operational surfaces are shut down in a controlled order.

Fly.io retirement result recorded on 2026-05-14:

- `flyctl apps destroy istampit-api --yes` completed successfully
- `flyctl status -a istampit-api` now returns `Could not find App "istampit-api"`
- `https://istampit-api.fly.dev/healthz` no longer resolves

## Confirmed Public Surfaces

- Retirement landing page: `istampit-web/app/page.tsx` and `istampit-web/app/HomeClient.tsx`, published at `https://istampit.io`
- Website: `https://istampit.io`
- Custom domain: `CNAME` is set to `istampit.io`
- Static hosting: GitHub Pages via `.github/workflows/pages.yml`
- Former API backend: Fly.io app `istampit-api` via `api/fly.toml`, destroyed on 2026-05-14
- GitHub Action: `SinAi-Inc/istampit-action` marketplace listing
- CLI package: `istampit-cli` on PyPI

## AWS Retirement Starting Point

Current repository evidence does **not** show the primary product hosted on AWS. The live web surface is GitHub Pages and the API is Fly.io. AWS work should therefore start as an inventory-and-confirm step, aimed at finding:

- Residual AWS-side certificates, redirects, CDN config, or stale support infrastructure for `istampit.io`
- Old CloudFront, S3, ACM, Route 53, ECS, or other non-core resources still tagged or named for `istampit`
- Any leftover non-production assets that survived earlier hosting changes

Authoritative domain ownership note:

- The `istampit.io` registrar/provider is **not** in AWS for the current shutdown path.
- Domain ownership and DNS/provider management are handled through the team's Name.com account.
- AWS retirement for iStampit is therefore limited to confirming that no residual AWS resources remain in supporting roles.

Use the workspace sunset script for that inventory:

```bash
ops/scripts/sunset_noncore_resources.sh inventory --regions <csv> --products istampit
```

After review, use the same script to stop approved resources and then generate a delete plan:

```bash
ops/scripts/sunset_noncore_resources.sh stop --regions <csv> --products istampit --execute
ops/scripts/sunset_noncore_resources.sh delete-plan --audit artifacts/sunset-audit-YYYYMMDD.json
```

Audit result recorded on 2026-05-13:

- `artifacts/sunset-audit-20260513.json` reported zero `istampit` resources across the audited AWS services in account `589820791129`
- Direct follow-up checks also found no `istampit` matches in Route 53 hosted zones, ACM certificates, CloudFront aliases, or S3 bucket names in that account
- Registrar/DNS ownership was later confirmed to be outside AWS and managed via Name.com

## Retirement Order

1. Keep the `istampit.io` landing page live as the public retirement notice until the final goodbye window ends.
2. Mark all public repositories and package readmes as retired.
3. Freeze or disable nonessential GitHub workflows once the goodbye page is live.
4. Retire the Fly.io API service `istampit-api` after any final data export or support window ends. Completed on 2026-05-14.
5. Run AWS inventory and tear down any confirmed residual `istampit` resources.
6. Remove or repoint the Name.com-managed domain and DNS only after the public goodbye window is complete.

## GitHub Actions and Repo Tasks

- Keep `.github/workflows/pages.yml` enabled long enough to publish the retirement landing page.
- `.github/workflows/ledger-update.yml` should remain manual-only during retirement so it does not keep regenerating archive ledger exports on a schedule.
- `.github/workflows/publish.yml` should remain manual-only and gated to explicit archival confirmation so PyPI releases do not continue by accident.
- `.github/workflows/smoke-tests.yml` should remain as a disabled archival stub now that the Fly.io API no longer exists.
- `.github/workflows/uptime-monitor.yml` should monitor the goodbye landing page on `https://istampit.io/` rather than feature pages such as `/verify`.
- Review whether other release or monitoring workflows still need to run; disable them once they no longer serve the archived state.
- Update repository descriptions and About text in GitHub UI to include `RETIRED`.
- Archive the repositories after the final public notices are in place.

## Domain and Hosting Tasks

- GitHub Pages:
  - Leave active only while the `istampit.io` landing page must remain publicly reachable.
  - Replace direct feature routes such as `/stamp` and `/verify` with retirement messaging before the Fly.io API is removed.
  - Remove deployment automation after the final static archive is published.
- Fly.io:
  - Export any required operational state before shutdown. Minimum read-only checks were completed on 2026-05-14:
    - `fly status -a istampit-api`
    - `fly logs -a istampit-api`
    - `fly ips list -a istampit-api`
    - `fly secrets list -a istampit-api`
    - `fly volumes list -a istampit-api`
  - Confirmed Fly inventory before destroy: 2 stopped machines in `iad`, no attached volumes, one deployed secret `REDIS_URL`, public IPv4 `66.241.125.206`, public dedicated IPv6 `2a09:8280:1::90:d686:0`, and no Fly-managed custom-domain certificates.
  - Recent Fly logs showed only controlled health/smoke activity and no evidence of ongoing external production use.
  - The public `/stamp` and `/verify` routes were switched to retirement messaging before the API was removed.
  - Final result: `fly apps destroy istampit-api --yes` completed on 2026-05-14 and the `istampit-api.fly.dev` hostname no longer resolves.
- DNS / certificates:
  - `istampit.io` is managed through the team's Name.com account, not through AWS Route 53 in account `589820791129`.
  - Remove stale DNS records, redirects, and any remaining provider-side forwarding after the goodbye page is no longer required.
  - If domain ownership is not being retained for archival messaging, close out the Name.com configuration as the final external step.

## Companion Package Tasks

- `istampit-action`:
  - Update marketplace-facing text to state retirement.
  - Decide whether to keep the marketplace listing visible or archive after a final notice period.
- `istampit-cli`:
  - Update PyPI long description to state retirement.
  - Avoid further feature releases unless needed for a final security fix or archival correction.

## Exit Criteria

The retirement can be considered complete when:

- `istampit.io` no longer advertises active product capabilities
- The `istampit.io` landing page has either completed its goodbye window or been intentionally retained as a static archive
- Public repos clearly state retirement
- The Fly.io API is shut down
- AWS inventory returns no remaining approved `istampit` resources
- Name.com-managed domain/DNS ownership is either intentionally preserved for archival messaging or fully removed
