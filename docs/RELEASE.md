# (Moved) Release Handbook

Canonical copy.

````markdown
# iStampit Release Handbook

This repo is a **meta-repo** that tracks versioned submodules:

- `istampit-auth` → auth.istampit.io
- `istampit-cli`
- `istampit-action`
- `site` (this repo’s app)

## Versioning

- Use **SemVer** across all repos.
- Root tag == coordination tag, not a package. It pins specific SHAs of submodules.

## Branch policy

- Mainline: `main` across all repos.
- Feature PRs land in each repo independently. The root updates submodule SHAs.

## Standard release flow

1. **Cut component releases (if needed)**
   - In each changed repo:
     - Update `CHANGELOG.md`
     - Bump version
     - Tag: `git tag vX.Y.Z && git push --tags`

2. **Update root submodules**

   ```bash
   git checkout main
   git pull
   git submodule update --remote --merge   # moves submodules to latest on their tracked branch
   git add istampit-auth istampit-cli istampit-action site
   git commit -m "chore(release): bump submodules"
   git push
   ```

3. **Tag the root**

   Tag with the same top-level version or a meta tag:

   ```bash
   git tag meta-vX.Y.Z
   git push --tags
   ```

## CI/CD

Root CI must run `git submodule update --init --recursive` before build.

Component repos have their own CI to publish artifacts (npm, GH Actions marketplace, deploy auth, etc).

## Hotfixes

Patch in component repo → tag → bump submodule SHA in root → tag root (`meta-vX.Y.Z+1`).

## Notes

Keep `.gitmodules` authoritative; don’t hand‑edit submodule URLs in `.git/config`.

Use Conventional Commits for clean changelogs.

````
