#!/usr/bin/env bash
set -euo pipefail

REPOS=("istampit-auth" "istampit-cli" "istampit-action" "istampit-web")
BRANCH="main"

echo "🔎 Verifying submodule SHAs are pushed and on $BRANCH…"

for r in "${REPOS[@]}"; do
  if [ ! -d "$r/.git" ]; then
    echo "❌ $r is not a git repo (expected submodule with its own .git)" >&2
    exit 1
  fi
  pushd "$r" >/dev/null
  CUR_SHA=$(git rev-parse --short HEAD)
  CUR_BRANCH=$(git rev-parse --abbrev-ref HEAD || echo "DETACHED")
  git fetch origin --tags >/dev/null 2>&1
  if ! git branch -r --contains "$(git rev-parse HEAD)" | grep -q "origin/$BRANCH"; then
    echo "❌ $r: HEAD $CUR_SHA not on origin/$BRANCH" >&2
    exit 1
  fi
  echo "✅ $r: $CUR_SHA present on origin/$BRANCH (local: $CUR_BRANCH)"
  popd >/dev/null
done

echo "✅ All submodules are on remote $BRANCH."
echo "💡 Next: commit submodule bumps, then tag the root (meta-vX.Y.Z)."
