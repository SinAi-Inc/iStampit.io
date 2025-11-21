#!/usr/bin/env node

/**
 * Remove ledger entries for files that don't exist
 * These are historical entries from Aug-Sep that were deleted on Nov 16
 * because they were timestamping empty placeholder files
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Removing orphaned ledger entries...\n');

// Read ledger
const ledgerPath = path.join(__dirname, '..', 'ledger.json');
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

const removed = [];
const kept = [];

// Check each entry
ledger.entries.forEach(entry => {
  // Convert receiptUrl to filesystem path
  const filepath = path.join(__dirname, '..', 'istampit-web', 'public', entry.receiptUrl);
  
  if (!fs.existsSync(filepath)) {
    console.log(`❌ Removing orphaned entry: ${entry.id}`);
    console.log(`   File not found: ${entry.receiptUrl}`);
    removed.push(entry);
  } else {
    kept.push(entry);
  }
});

// Update ledger
ledger.entries = kept;
ledger.metadata.totalEntries = kept.length;
ledger.metadata.confirmedEntries = kept.filter(e => e.status === 'confirmed').length;
ledger.metadata.pendingEntries = kept.filter(e => e.status === 'pending').length;
ledger.metadata.lastUpdated = new Date().toISOString();

// Save
fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + '\n');

console.log('\n📊 Cleanup Summary:');
console.log(`   Before: ${removed.length + kept.length} entries`);
console.log(`   After: ${kept.length} entries`);
console.log(`   Removed: ${removed.length} orphaned entries`);
console.log(`   Confirmed: ${ledger.metadata.confirmedEntries}`);
console.log(`   Pending: ${ledger.metadata.pendingEntries}`);
console.log('\n✅ Ledger cleaned successfully!');
