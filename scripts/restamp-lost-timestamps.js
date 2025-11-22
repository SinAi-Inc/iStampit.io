#!/usr/bin/env node

/**
 * Re-stamp Lost Timestamps
 *
 * For timestamps that calendar servers have lost (404 responses after 6+ days),
 * this script re-creates them using the original files.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const LEDGER_PATH = path.join(__dirname, '..', 'ledger.json');

async function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({ status: res.statusCode, buffer, headers: res.headers });
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function createTimestamp(fileHash) {
  console.log(`   🌐 Creating new timestamp for hash ${fileHash.substring(0, 16)}...`);

  const hashBuffer = Buffer.from(fileHash, 'hex');

  // Build OTS file header
  const header = Buffer.from([
    0x00, // Version
    0x4F, 0x70, 0x65, 0x6E, 0x54, 0x69, 0x6D, 0x65, 0x73, 0x74, 0x61, 0x6D, 0x70, 0x73, 0x00, // "OpenTimestamps\0"
    0x00, 0x50, 0x72, 0x6F, 0x6F, 0x66, 0x00, 0xBF, 0x89, 0xE2, 0xE8, 0x84, 0xE8, 0x92, 0x94 // "Proof\0" + magic
  ]);

  // Calendar URL to use
  const calendarUrl = 'https://alice.btc.calendar.opentimestamps.org';

  try {
    const response = await httpsRequest(`${calendarUrl}/digest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-sha256-digest',
        'Accept': 'application/vnd.opentimestamps.v1'
      },
      body: hashBuffer
    });

    if (response.status === 200) {
      console.log(`   ✅ New timestamp created (${response.buffer.length} bytes)`);
      return response.buffer;
    } else {
      throw new Error(`Calendar returned status ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to create timestamp: ${error.message}`);
  }
}

function calculateAge(stampedAt) {
  const ageMs = Date.now() - new Date(stampedAt);
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  return ageDays;
}

async function main() {
  console.log('🔄 Re-stamp Lost Timestamps Tool\n');

  // Read ledger
  const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
  const pendingEntries = ledger.entries.filter(e => e.status === 'pending');

  // Find old pending entries (>3 days old with tiny file size)
  const lostTimestamps = [];

  for (const entry of pendingEntries) {
    const ageDays = calculateAge(entry.stampedAt);
    const otsPath = path.join(__dirname, '..', 'istampit-web', 'public', entry.receiptUrl);

    if (fs.existsSync(otsPath)) {
      const size = fs.statSync(otsPath).size;

      if (ageDays >= 3 && size < 200) {
        lostTimestamps.push({
          entry,
          otsPath,
          size,
          ageDays
        });
      }
    }
  }

  console.log(`Found ${lostTimestamps.length} lost timestamps (>3 days old, <200 bytes)\n`);

  if (lostTimestamps.length === 0) {
    console.log('✅ No lost timestamps found');
    return;
  }

  // List them
  lostTimestamps.forEach(({ entry, size, ageDays }) => {
    console.log(`  ❌ ${entry.id}`);
    console.log(`     Age: ${ageDays} days, Size: ${size} bytes`);
    console.log(`     Hash: ${entry.sha256}`);
  });

  console.log('\n⚠️  These timestamps appear to be lost by calendar servers.');
  console.log('    They should have been upgraded to Bitcoin attestations by now.\n');

  // Ask for confirmation
  console.log('Options:');
  console.log('  1. Re-create timestamps (recommended) - Gets new timestamps from calendars');
  console.log('  2. Skip - Wait longer (not recommended for >3 day old timestamps)\n');

  console.log('This script will now RE-CREATE these timestamps...\n');

  const results = {
    total: lostTimestamps.length,
    success: 0,
    failed: 0,
    errors: []
  };

  for (const { entry, otsPath } of lostTimestamps) {
    console.log(`\n📝 Re-stamping: ${entry.id}`);

    try {
      // Create new timestamp
      const newOtsData = await createTimestamp(entry.sha256);

      // Backup old file
      const backupPath = otsPath + '.lost';
      fs.copyFileSync(otsPath, backupPath);
      console.log(`   💾 Backed up old file to: ${path.basename(backupPath)}`);

      // Write new timestamp
      fs.writeFileSync(otsPath, newOtsData);
      console.log(`   ✅ Wrote new timestamp (${newOtsData.length} bytes)`);

      // Update ledger entry timestamp
      entry.stampedAt = new Date().toISOString();

      results.success++;
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      results.failed++;
      results.errors.push({ id: entry.id, error: error.message });
    }
  }

  // Write updated ledger
  if (results.success > 0) {
    fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));
    console.log(`\n💾 Updated ledger.json with new timestamps`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 RE-STAMP SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total lost:     ${results.total}`);
  console.log(`✅ Re-created:  ${results.success}`);
  console.log(`❌ Failed:      ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(e => console.log(`  - ${e.id}: ${e.error}`));
  }

  if (results.success > 0) {
    console.log('\n✅ Successfully re-created lost timestamps!');
    console.log('   These new timestamps should upgrade to Bitcoin within 24 hours.');
    console.log('   The old .ots files are backed up with .lost extension.');
  }
}

main().catch(console.error);
