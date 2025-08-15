#!/usr/bin/env bash
set -euo pipefail

echo "[init-submodules] starting"
which git || { echo "git not found"; exit 127; }
echo "Git version: $(git --version)"

# Decide token priority: explicit SUBMODULES_TOKEN preferred; fallback to GITHUB_TOKEN
RAW_TOKEN="${SUBMODULES_TOKEN:-}"
TOKEN_KIND="SUBMODULES_TOKEN"
if [[ -z "$RAW_TOKEN" && -n "${GITHUB_TOKEN:-}" ]]; then
  RAW_TOKEN="$GITHUB_TOKEN"
  TOKEN_KIND="GITHUB_TOKEN"
fi

if [[ -z "$RAW_TOKEN" ]]; then
  echo "::error::No SUBMODULES_TOKEN or GITHUB_TOKEN env var available for private submodules." >&2
  exit 1
fi

# Mask token in logs (GitHub Actions command)
echo "::add-mask::$RAW_TOKEN"
LEN=${#RAW_TOKEN}
if (( LEN < 20 )); then
  echo "::warning::Token length ${LEN} seems short; ensure correct secret name & scope." >&2
fi

echo "Using token source: $TOKEN_KIND"

echo "Configuring git insteadOf to inject token via HTTPS..."
# Use x-access-token: prefix (works for both GITHUB_TOKEN & PAT per GitHub docs)
# Replace any prior mapping to ensure we don't accumulate multiple entries
git config --global --unset-all url."https://x-access-token:".insteadOf 2>/dev/null || true
# Map generic github.com URLs to include token
# NOTE: quoting important to avoid shell expansion
TOKEN_URL="https://x-access-token:${RAW_TOKEN}@github.com/"
git config --global url."${TOKEN_URL}".insteadOf https://github.com/

echo "Configured mappings:"
git config -l | grep '^url\.' || true

if [[ -f .gitmodules ]]; then
  echo "--- .gitmodules ---"
  sed 's/token=.*$/token=***redacted***/' .gitmodules || cat .gitmodules
  echo "-------------------"
else
  echo "No .gitmodules file present; nothing to do."
  exit 0
fi

echo "Syncing submodule URLs (git submodule sync)..."
git submodule sync --recursive || true

# Attempt shallow init first
attempt_shallow() {
  echo "Attempting shallow submodule init (depth=1)..."
  git submodule update --init --recursive --depth=1
}

if ! attempt_shallow; then
  echo "Shallow init failed; retrying with full history for diagnostics..." >&2
  if ! git submodule update --init --recursive; then
    echo "::error::Full submodule init failed." >&2
    echo "Listing submodule status for debugging:" >&2
    git submodule status || true
    echo "Attempting ls-remote on each configured URL:" >&2
    # Iterate declared submodules from .gitmodules
    awk '/\[submodule/ {gsub(/\[|\]|submodule \"|\"/,"",$0); name=$2} /url =/ {print name" "$3}' .gitmodules | while read -r name url; do
      echo "-- $name -> $url" >&2
      git ls-remote "$url" HEAD >/dev/null 2>&1 && echo "   OK: reachable" || echo "   FAIL: unreachable" >&2
    done
    exit 42
  fi
fi

missing=0
while read -r state sha path; do
  [[ -z "$sha" ]] && continue
  if [[ "$sha" =~ ^[0-9a-f]{40}$ ]]; then
    if [[ ! -d "$path/.git" ]]; then
      echo "::error::Submodule directory missing after init: $path" >&2
      missing=1
    fi
  fi
done < <(git submodule status || true)

if (( missing )); then
  echo "::error::One or more submodules incomplete." >&2
  exit 43
fi

echo "Submodules initialized successfully."
