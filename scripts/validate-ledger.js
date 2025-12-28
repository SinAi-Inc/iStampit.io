#!/usr/bin/env node

/**
 * Validate and Clean Ledger
 *
 * - Validates all ledger entries have corresponding .ots files
 * - Removes entries for backup/nested .ots files
 * - Keeps only legitimate .ots file entries
 * - Removes any duplicate SHA256 entries
 */

const fs = require('fs');
const path = require('path');

const LEDGER_PATH = path.join(__dirname, '..', 'ledger.json');
const BITCOIN_MARKER = Buffer.from([0x05, 0x88]);

function isLegitimateOtsPath(receiptUrl) {
  const filename = path.basename(receiptUrl);

  // Must end with .ots
  if (!filename.endsWith('.ots')) return false;

  // Check for backup/nested patterns
  const parts = filename.split('.');
  const otsCount = parts.filter(p => p === 'ots').length;

  // More than one .ots extension = nested
  if (otsCount > 1) return false;

  // Contains .bak = backup
  if (filename.includes('.bak')) return false;

  // Contains .lost = backup
  if (filename.includes('.lost')) return false;

  return true;
}

function checkBitcoinAttestation(otsPath) {
  try {
    const fullPath = path.join(__dirname, '..', 'istampit-web', 'public', otsPath);
    const data = fs.readFileSync(fullPath);
    return data.includes(BITCOIN_MARKER);
  } catch (error) {
    return false;
  }
}

function fileExists(receiptUrl) {
  const fullPath = path.join(__dirname, '..', 'istampit-web', 'public', receiptUrl);
  return fs.existsSync(fullPath);
}

async function main() {
  console.log('🔍 Validating and Cleaning Ledger\n');

  // Read current ledger
  const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
  console.log(`Current ledger: ${ledger.entries.length} entries\n`);

  // Statistics
  const stats = {
    total: ledger.entries.length,
    legitimate: 0,
    backup: 0,
    missing: 0,
    duplicates: 0,
    statusUpdated: 0
  };

  // Track seen SHA256 hashes
  const seenHashes = new Set();
  const cleanEntries = [];

  for (const entry of ledger.entries) {
    // Check if duplicate SHA256
    if (seenHashes.has(entry.sha256)) {
      console.log(`❌ Duplicate SHA256: ${entry.id}`);
      stats.duplicates++;
      continue;
    }

    // Check if file exists
    if (!fileExists(entry.receiptUrl)) {
      console.log(`❌ Missing file: ${entry.id} (${entry.receiptUrl})`);
      stats.missing++;
      continue;
    }

    // Check if legitimate .ots file (not backup/nested)
    if (!isLegitimateOtsPath(entry.receiptUrl)) {
      console.log(`❌ Backup/nested file: ${entry.id} (${path.basename(entry.receiptUrl)})`);
      stats.backup++;
      continue;
    }

    // Check and update Bitcoin confirmation status
    const hasBitcoin = checkBitcoinAttestation(entry.receiptUrl);
    const shouldBeConfirmed = hasBitcoin && entry.status !== 'confirmed';

    if (shouldBeConfirmed) {
      entry.status = 'confirmed';
      console.log(`✅ Updated to confirmed: ${entry.id}`);
      stats.statusUpdated++;
    } else if (entry.status === 'confirmed') {
      console.log(`✅ Already confirmed: ${entry.id}`);
    } else {
      console.log(`⏳ Pending: ${entry.id}`);
    }

    seenHashes.add(entry.sha256);
    cleanEntries.push(entry);
    stats.legitimate++;
  }

  // Update metadata
  const cleanLedger = {
    entries: cleanEntries,
    metadata: {
      lastUpdated: new Date().toISOString(),
      totalEntries: cleanEntries.length,
      confirmedEntries: cleanEntries.filter(e => e.status === 'confirmed').length,
      pendingEntries: cleanEntries.filter(e => e.status === 'pending').length
    }
  };

  // Write clean ledger
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(cleanLedger, null, 2));

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Original entries:        ${stats.total}`);
  console.log(`❌ Backup/nested files:  ${stats.backup}`);
  console.log(`❌ Missing files:        ${stats.missing}`);
  console.log(`❌ Duplicate SHA256:     ${stats.duplicates}`);
  console.log(`✅ Legitimate entries:   ${stats.legitimate}`);
  console.log(``);
  console.log(`📊 Final Ledger:`);
  console.log(`   Total:                ${cleanLedger.metadata.totalEntries}`);
  console.log(`   ✅ Confirmed:         ${cleanLedger.metadata.confirmedEntries}`);
  console.log(`   ⏳ Pending:           ${cleanLedger.metadata.pendingEntries}`);
  console.log(`   📝 Status updated:    ${stats.statusUpdated}`);

  console.log('\n✅ Ledger validation and cleanup completed!');
}

main().catch(console.error);
