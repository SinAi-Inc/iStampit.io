#!/usr/bin/env node
/**
 * CSP generator for iStampit static deployment.
 * Computes SHA-256 for inline GA scripts (consent + config) to allow strict script-src without 'unsafe-inline'.
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Fallback inline script sources (keep in sync with components/GoogleTag.tsx)
const inlineScripts = {
  consent: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'granted'
          });`,
  gtagConfig: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX', {
            send_page_view: true,
            page_path: window.location.pathname
          });`
};

// Attempt to parse actual file to avoid drift
try {
  const googleTagPath = path.join(__dirname, '../components/GoogleTag.tsx');
  const source = fs.readFileSync(googleTagPath, 'utf8');
  const consentMatch = source.match(/<Script id="consent-default"[\s\S]*?>\n{`([\s\S]*?)`}/);
  const configMatch = source.match(/<Script id="gtag-config"[\s\S]*?>\n{`([\s\S]*?)`}/);
  if (consentMatch) inlineScripts.consent = consentMatch[1].trim();
  if (configMatch) inlineScripts.gtagConfig = configMatch[1].trim();
} catch (e) {
  // ignore; use fallback
}

function sha256Base64(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('base64');
}

const consentHash = sha256Base64(inlineScripts.consent);
const configHash = sha256Base64(inlineScripts.gtagConfig);

// Note: Replace G-XXXXXXXXXX placeholder with actual GA_ID prior to generating final CSP in production.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "img-src 'self' data: https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'", // Tailwind inline styles (could be hashed if tightened)
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com",
  "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'sha256-" + consentHash + "' 'sha256-" + configHash + "'",
  "frame-src 'self'",
  "upgrade-insecure-requests"
].join('; ');

const outDir = path.join(__dirname, '../artifacts');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'csp-header.txt');
fs.writeFileSync(outFile, 'Content-Security-Policy: ' + csp + '\n');

console.log('✅ CSP generated');
console.log('   consent hash : sha256-' + consentHash);
console.log('   config hash  : sha256-' + configHash);
console.log('   output       : artifacts/csp-header.txt');
console.log('\nAdd header:');
console.log('Content-Security-Policy: ' + csp + '\n');
