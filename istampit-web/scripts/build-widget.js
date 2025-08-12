#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

/**
 * Build script to create content-hashed widget file for SRI
 */

function main() {
  const publicDir = path.join(__dirname, '../public');
  const widgetDir = path.join(publicDir, 'widget');
  const originalWidget = path.join(widgetDir, 'v1.js');

  if (!fs.existsSync(originalWidget)) {
    console.error('❌ Widget file not found:', originalWidget);
    process.exit(1);
  }

  const content = fs.readFileSync(originalWidget, 'utf8');

  // Generate SHA-256 hash
  const hash = crypto.createHash('sha256').update(content, 'utf8').digest('hex');
  const shortHash = hash.substring(0, 12);

  // Create versioned filename
  const versionedWidget = path.join(widgetDir, `v1.${shortHash}.js`);

  // Write versioned file
  fs.writeFileSync(versionedWidget, content);

  // Generate integrity hash (base64)
  const integrityHash = crypto.createHash('sha256').update(content, 'utf8').digest('base64');

  // Create manifest
  const manifest = {
    version: 'v1.0.0',
    filename: `v1.${shortHash}.js`,
    sha256: hash,
    integrity: `sha256-${integrityHash}`,
    size: content.length,
    buildTime: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(widgetDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Create SRI snippet for docs
  const snippet = `<script
  src="https://istampit.io/widget/v1.${shortHash}.js"
  integrity="sha256-${integrityHash}"
  crossorigin="anonymous"
  async>
</script>`;

  fs.writeFileSync(path.join(widgetDir, 'sri-snippet.html'), snippet);

  console.log('✅ Widget build complete:');
  console.log(`   📦 File: v1.${shortHash}.js`);
  console.log(`   🔒 SHA256: ${hash}`);
  console.log(`   🛡️ Integrity: sha256-${integrityHash}`);
  console.log(`   📏 Size: ${content.length.toLocaleString()} bytes`);
  console.log(`   📄 SRI snippet: widget/sri-snippet.html`);
}

if (require.main === module) {
  main();
}

module.exports = { main };
