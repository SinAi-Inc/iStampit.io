#!/usr/bin/env node
// Post-export sanity check for critical pages (e.g., /verify) when STATIC_EXPORT=1
const fs = require('fs');
const path = require('path');
if (process.env.STATIC_EXPORT !== '1') process.exit(0);
const outDir = path.join(process.cwd(), 'out');
const required = ['verify/index.html'];
let missing = [];
for (const rel of required) {
  const p = path.join(outDir, rel);
  if (!fs.existsSync(p)) missing.push(rel);
}
if (missing.length) {
  console.error(`❌ Static export missing required pages: ${missing.join(', ')}`);
  process.exit(1);
} else {
  console.log('✅ Static export contains required pages.');
}
