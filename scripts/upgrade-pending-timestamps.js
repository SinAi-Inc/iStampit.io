#!/usr/bin/env node

/**
 * Upgrade Pending Timestamps
 * 
 * Fetches Bitcoin attestations from OpenTimestamps calendar servers
 * for pending timestamp files and upgrades them.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const LEDGER_PATH = path.join(__dirname, '..', 'ledger.json');
const CALENDAR_URLS = [
  'https://a.pool.opentimestamps.org',
  'https://b.pool.opentimestamps.org',
  'https://alice.btc.calendar.opentimestamps.org',
  'https://bob.btc.calendar.opentimestamps.org',
  'https://finney.calendar.eternitywall.com'
];

// Bitcoin attestation marker
const BITCOIN_MARKER = Buffer.from([0x05, 0x88]);

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

async function upgradeTimestamp(otsFilePath) {
  console.log(`\n📤 Upgrading: ${path.basename(otsFilePath)}`);
  
  // Read current .ots file
  const otsData = fs.readFileSync(otsFilePath);
  const originalSize = otsData.length;
  
  console.log(`   Current size: ${originalSize} bytes`);
  
  // Check if already has Bitcoin attestation
  if (otsData.includes(BITCOIN_MARKER)) {
    console.log(`   ✅ Already has Bitcoin attestation`);
    return { upgraded: false, reason: 'already_confirmed' };
  }
  
  // Try each calendar server
  let upgraded = false;
  let newOtsData = otsData;
  
  for (const calendarUrl of CALENDAR_URLS) {
    try {
      console.log(`   🌐 Trying ${new URL(calendarUrl).hostname}...`);
      
      const response = await httpsRequest(`${calendarUrl}/timestamp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Accept': 'application/vnd.opentimestamps.v1'
        },
        body: otsData
      });
      
      if (response.status === 200 && response.buffer.length > originalSize) {
        console.log(`   ✅ Received upgrade: ${response.buffer.length} bytes`);
        newOtsData = response.buffer;
        upgraded = true;
        break;
      } else {
        console.log(`   ℹ️  No upgrade available yet (${response.status})`);
      }
    } catch (error) {
      console.log(`   ⚠️  Error: ${error.message}`);
    }
  }
  
  if (upgraded) {
    // Write upgraded file
    fs.writeFileSync(otsFilePath, newOtsData);
    console.log(`   💾 Saved upgraded file (${newOtsData.length} bytes)`);
    
    // Verify Bitcoin attestation
    const hasBitcoin = newOtsData.includes(BITCOIN_MARKER);
    console.log(`   🔍 Bitcoin attestation: ${hasBitcoin ? '✅ YES' : '❌ NO'}`);
    
    return {
      upgraded: true,
      oldSize: originalSize,
      newSize: newOtsData.length,
      hasBitcoin
    };
  }
  
  return { upgraded: false, reason: 'no_upgrade_available' };
}

async function main() {
  console.log('🔧 OpenTimestamps Upgrade Tool\n');
  
  // Read ledger
  const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
  const pendingEntries = ledger.entries.filter(e => e.status === 'pending');
  
  console.log(`Found ${pendingEntries.length} pending entries\n`);
  
  if (pendingEntries.length === 0) {
    console.log('✅ All timestamps are confirmed!');
    return;
  }
  
  const results = {
    total: pendingEntries.length,
    upgraded: 0,
    alreadyConfirmed: 0,
    noUpgrade: 0,
    errors: []
  };
  
  // Process each pending entry
  for (const entry of pendingEntries) {
    const otsPath = path.join(__dirname, '..', 'istampit-web', 'public', entry.receiptUrl);
    
    if (!fs.existsSync(otsPath)) {
      console.log(`❌ File not found: ${entry.receiptUrl}`);
      results.errors.push({ id: entry.id, error: 'file_not_found' });
      continue;
    }
    
    try {
      const result = await upgradeTimestamp(otsPath);
      
      if (result.upgraded) {
        results.upgraded++;
      } else if (result.reason === 'already_confirmed') {
        results.alreadyConfirmed++;
      } else {
        results.noUpgrade++;
      }
    } catch (error) {
      console.log(`❌ Error upgrading ${entry.id}: ${error.message}`);
      results.errors.push({ id: entry.id, error: error.message });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 UPGRADE SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total pending:        ${results.total}`);
  console.log(`✅ Upgraded:          ${results.upgraded}`);
  console.log(`✅ Already confirmed: ${results.alreadyConfirmed}`);
  console.log(`⏳ No upgrade yet:    ${results.noUpgrade}`);
  console.log(`❌ Errors:            ${results.errors.length}`);
  
  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(e => console.log(`  - ${e.id}: ${e.error}`));
  }
  
  if (results.upgraded > 0) {
    console.log('\n🎉 Run update-ledger-status.js to update the ledger');
  } else if (results.noUpgrade > 0) {
    console.log('\n⏳ Timestamps not yet included in Bitcoin blockchain');
    console.log('   Please try again in a few hours');
  }
}

main().catch(console.error);
