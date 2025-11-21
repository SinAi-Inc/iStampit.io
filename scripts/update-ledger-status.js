#!/usr/bin/env node
/**
 * Update Ledger Status Script
 *
 * Scans all .ots files referenced in ledger.json and updates their status
 * based on whether they contain Bitcoin block attestations.
 */

const fs = require('fs');
const path = require('path');

// Read ledger
const ledgerPath = path.join(__dirname, '..', 'ledger.json');
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

console.log('🔍 Checking pending timestamps for Bitcoin confirmations...\n');

let updated = 0;
let checked = 0;
let errors = 0;

// Bitcoin attestation marker: 0x05 0x88
function hasBitcoinAttestation(otsFilePath) {
  try {
    const bytes = fs.readFileSync(otsFilePath);
    for (let i = 0; i < bytes.length - 1; i++) {
      if (bytes[i] === 0x05 && bytes[i + 1] === 0x88) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`   ❌ Error reading ${otsFilePath}: ${error.message}`);
    return false;
  }
}

// Process each pending entry
for (const entry of ledger.entries) {
  if (entry.status !== 'pending') {
    continue;
  }

  checked++;

  // Convert receiptUrl to file path
  const otsPath = entry.receiptUrl.startsWith('/')
    ? path.join(__dirname, '..', 'istampit-web', 'public', entry.receiptUrl)
    : path.join(__dirname, '..', entry.receiptUrl);

  if (!fs.existsSync(otsPath)) {
    console.log(`   ⚠️  ${entry.id}: Receipt file not found at ${otsPath}`);
    errors++;
    continue;
  }

  if (hasBitcoinAttestation(otsPath)) {
    console.log(`   ✅ ${entry.id}: Bitcoin confirmation found!`);
    entry.status = 'confirmed';
    // Note: blockHeight would require parsing the full .ots file properly
    // For now we just mark as confirmed
    updated++;
  }
}

// Update metadata
ledger.metadata.confirmedEntries = ledger.entries.filter(e => e.status === 'confirmed').length;
ledger.metadata.pendingEntries = ledger.entries.filter(e => e.status === 'pending').length;
ledger.metadata.lastUpdated = new Date().toISOString();

// Save updated ledger
fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + '\n');

console.log(`\n📊 Summary:`);
console.log(`   Checked: ${checked} pending entries`);
console.log(`   Updated: ${updated} newly confirmed`);
console.log(`   Errors: ${errors}`);
console.log(`   Total confirmed: ${ledger.metadata.confirmedEntries}`);
console.log(`   Total pending: ${ledger.metadata.pendingEntries}`);
console.log(`\n✅ Ledger updated successfully!`);
