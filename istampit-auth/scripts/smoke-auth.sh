#!/usr/bin/env bash
set -euo pipefail

AUTH_ORIGIN="${AUTH_ORIGIN:-https://app.istampit.io}"
MARKETING_ORIGIN="${MARKETING_ORIGIN:-https://www.istampit.io}"

green(){ printf "\033[32m%s\033[0m\n" "$*"; }
red(){ printf "\033[31m%s\033[0m\n" "$*"; }

echo "→ Health check"
code=$(curl -s -o /dev/null -w "%{http_code}" "$AUTH_ORIGIN/api/health")
[[ "$code" -eq 200 ]] && green "OK /api/health" || { red "FAIL /api/health ($code)"; exit 1; }

echo "→ Session (unauthenticated)"
body=$(curl -s -H "Accept: application/json" "$AUTH_ORIGIN/api/session")
echo "$body" | grep -q '"authenticated":false' && green "OK unauth session" || { red "FAIL unauth session: $body"; exit 1; }

echo "→ CORS preflight (OPTIONS)"
resp=$(curl -s -i -X OPTIONS \
  -H "Origin: $MARKETING_ORIGIN" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Accept" \
  "$AUTH_ORIGIN/api/session")

echo "$resp" | grep -qi "HTTP/2 204\|HTTP/1.1 204" || { red "FAIL preflight: not 204"; echo "$resp"; exit 1; }
echo "$resp" | grep -qi "access-control-allow-origin: $MARKETING_ORIGIN" || { red "FAIL CORS allow-origin"; echo "$resp"; exit 1; }
echo "$resp" | grep -qi "access-control-allow-credentials: true" || { red "FAIL allow-credentials"; echo "$resp"; exit 1; }
green "OK CORS preflight"

green "✓ Smoke tests passed"
