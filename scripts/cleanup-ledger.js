#!/usr/bin/env node

/**
 * Cleanup Ledger Script
 * Remove nested .ots.bak chains, keep only primary timestamps
 */

const fs = require('fs');
const path = require('path');

const LEDGER_PATH = path.join(__dirname, '..', 'ledger.json');

console.log('🧹 Cleaning up ledger from nested .ots backup chains...\n');

// Read ledger
const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
const before = ledger.entries.length;

// Filter out nested .ots backups
// Keep only:
// - Manual timestamps (non-auto)
// - Primary auto timestamps (ending in .ots but not .ots.bak.ots or .ots.ots etc.)
ledger.entries = ledger.entries.filter(entry => {
  // Keep all non-auto entries
  if (!entry.id.startsWith('auto-')) {
    return true;
  }
  
  // For auto entries, keep only primary .ots files
  const url = entry.receiptUrl;
  
  // Exclude if it has nested backup patterns
  if (url.includes('.ots.bak') || url.includes('.ots.ots')) {
    console.log(`   ❌ Removing nested backup: ${entry.id}`);
    return false;
  }
  
  // Exclude if it's a .bak.ots (only first-level backup)
  if (url.endsWith('.bak.ots')) {
    console.log(`   ⚠️  Removing backup: ${entry.id}`);
    return false;
  }
  
  return true;
});

const after = ledger.entries.length;
const removed = before - after;

// Recalculate metadata
ledger.metadata.totalEntries = ledger.entries.length;
ledger.metadata.confirmedEntries = ledger.entries.filter(e => e.status === 'confirmed').length;
ledger.metadata.pendingEntries = ledger.entries.filter(e => e.status === 'pending').length;
ledger.metadata.lastUpdated = new Date().toISOString();

// Save cleaned ledger
fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));

console.log(`\n📊 Cleanup Summary:`);
console.log(`   Before: ${before} entries`);
console.log(`   After: ${after} entries`);
console.log(`   Removed: ${removed} nested backups`);
console.log(`   Confirmed: ${ledger.metadata.confirmedEntries}`);
console.log(`   Pending: ${ledger.metadata.pendingEntries}`);
console.log(`\n✅ Ledger cleaned successfully!`);
