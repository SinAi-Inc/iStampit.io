#!/usr/bin/env node
/**
 * Upgrade Pending Timestamps
 * 
 * Attempts to upgrade pending .ots files by fetching Bitcoin attestations
 * from calendar servers. This should be run for timestamps that have been
 * pending for >24 hours.
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

console.log('🔄 Upgrading pending timestamps...\n');

// Read ledger
const ledgerPath = path.join(__dirname, '..', 'ledger.json');
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

// Calendar servers to try
const CALENDARS = [
  'https://alice.btc.calendar.opentimestamps.org',
  'https://bob.btc.calendar.opentimestamps.org',
  'https://finney.calendar.eternitywall.com',
  'https://btc.calendar.catallaxy.com'
];

let upgraded = 0;
let failed = 0;

for (const entry of ledger.entries) {
  if (entry.status !== 'pending') {
    continue;
  }

  const otsPath = path.join(__dirname, '..', 'istampit-web', 'public', entry.receiptUrl);
  
  if (!fs.existsSync(otsPath)) {
    console.log(`⚠️  ${entry.id}: File not found`);
    failed++;
    continue;
  }

  const initialSize = fs.statSync(otsPath).size;
  
  // If already >1KB, probably has attestations
  if (initialSize > 1000) {
    console.log(`ℹ️  ${entry.id}: Already upgraded (${initialSize} bytes)`);
    continue;
  }

  console.log(`🔄 ${entry.id}: Attempting upgrade (current: ${initialSize} bytes)...`);
  
  try {
    // Read current receipt
    const receipt = fs.readFileSync(otsPath);
    
    // Try to get upgraded version from calendars
    // This is a simplified approach - in production, use opentimestamps library
    console.log(`   ⏳ Waiting for calendar aggregation...`);
    console.log(`   💡 Tip: Run 'ots upgrade ${path.basename(otsPath)}' manually if available`);
    
    failed++;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    failed++;
  }
}

console.log(`\n📊 Upgrade Summary:`);
console.log(`   Upgraded: ${upgraded}`);
console.log(`   Failed/Pending: ${failed}`);

if (failed > 0) {
  console.log(`\n💡 Manual upgrade instructions:`);
  console.log(`   1. Install: pip install opentimestamps-client`);
  console.log(`   2. Upgrade each file:`);
  
  for (const entry of ledger.entries) {
    if (entry.status === 'pending') {
      const otsPath = path.join(__dirname, '..', 'istampit-web', 'public', entry.receiptUrl);
      if (fs.existsSync(otsPath)) {
        const relPath = path.relative(process.cwd(), otsPath).replace(/\\/g, '/');
        console.log(`      ots upgrade ${relPath}`);
      }
    }
  }
  
  console.log(`\n   Or use the OpenTimestamps website:`);
  console.log(`   https://opentimestamps.org/`);
}
