#!/usr/bin/env bash
set -euo pipefail

# Verifies that each recorded submodule SHA exists on its remote.
# Exits 42 if any missing so workflow can distinguish integrity failure.

echo "[submodules] verifying recorded SHAs exist upstream"
missing=0
# Read submodule status lines: leading char indicates state, then SHA, then path
while read -r line; do
  sha=$(echo "$line" | awk '{print $2}')
  path=$(echo "$line" | awk '{print $3}')
  path=${path#-}
  path=${path#*} # strip possible leading markers
  [[ -z "${sha}" ]] && continue
  if [[ ${sha} =~ ^[0-9a-f]{40}$ ]]; then
    url=$(git config --file .gitmodules --get submodule."$path".url || true)
    if [[ -z "$url" ]]; then
      echo "WARN: no url for submodule $path"; continue
    fi
    if ! git ls-remote "$url" "$sha" >/dev/null 2>&1; then
      echo "ERROR: submodule $path references $sha which is not present on remote $url" >&2
      missing=1
    else
      echo "OK: $path -> ${sha:0:7} present"
    fi
  fi
done < <(git submodule status)

if [[ $missing -ne 0 ]]; then
  echo "One or more submodule SHAs missing upstream." >&2
  exit 42
fi

echo "All submodule SHAs present."
