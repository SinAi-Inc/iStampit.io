#!/usr/bin/env node
/**
 * Build-time environment validation.
 * Fails (exit 1) if critical public env vars are missing or mismatched.
 */

const PROD_AUTH_ORIGIN = 'https://auth.istampit.io';
// Comma separated list of additional allowed origins (staging, preview, etc.)
// e.g. STAGING_AUTH_ORIGINS="https://staging-auth.istampit.io,https://preview-auth.example.com"
const stagingList = (process.env.STAGING_AUTH_ORIGINS || process.env.ALLOWED_AUTH_ORIGINS || '')
  .split(/[,\s]+/)
  .map(s => s.trim())
  .filter(Boolean);
const ALLOWED = Array.from(new Set([PROD_AUTH_ORIGIN, ...stagingList]));

// Attempt to read .env.local for local builds if variable unset
if (!process.env.NEXT_PUBLIC_AUTH_ORIGIN) {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
      for (const line of lines) {
        const m = line.match(/^NEXT_PUBLIC_AUTH_ORIGIN=(.+)$/);
        if (m) process.env.NEXT_PUBLIC_AUTH_ORIGIN = m[1].trim();
      }
    }
  } catch {}
}

let failed = false;
const actualAuth = process.env.NEXT_PUBLIC_AUTH_ORIGIN;
if (!actualAuth) {
  console.warn('ℹ NEXT_PUBLIC_AUTH_ORIGIN not set; auth requests will use relative same-origin endpoints. This is OK for local dev or unified deployments.');
} else {
  const norm = s => s.replace(/\/$/, '');
  const allowLocal = process.env.STATIC_EXPORT !== '1';
  if (!ALLOWED.map(norm).includes(norm(actualAuth)) && !(allowLocal && norm(actualAuth).startsWith('http://localhost'))) {
    console.error(`❌ NEXT_PUBLIC_AUTH_ORIGIN '${actualAuth}' not in allowed set: ${ALLOWED.join(', ')}`);
    failed = true;
  } else {
    console.log(`✅ NEXT_PUBLIC_AUTH_ORIGIN = ${actualAuth}`);
  }
}

if (stagingList.length) {
  console.log('ℹ Allowed staging auth origins:', stagingList.join(', '));
}

if (failed) {
  if (process.env.ALLOW_UNSAFE_ENV === '1') {
    console.warn('\n⚠ Environment validation failed but ALLOW_UNSAFE_ENV=1 set; continuing anyway.');
  } else {
    console.error('\nEnvironment validation failed. Refusing to build. Set ALLOW_UNSAFE_ENV=1 to bypass (not recommended).');
    process.exit(1);
  }
} else {
  console.log('\nEnvironment validation passed.');
}
