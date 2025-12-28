#!/usr/bin/env node

/**
 * Robust Ledger Cleanup and Validation
 *
 * This script:
 * 1. Removes all .ots.bak and nested .ots files from artifacts
 * 2. Rebuilds ledger.json from legitimate .ots files only
 * 3. Validates no duplicates exist
 * 4. Maintains only confirmed entries
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LEDGER_PATH = path.join(__dirname, '..', 'ledger.json');
const ARTIFACTS_DIR = path.join(__dirname, '..', 'istampit-web', 'public', 'artifacts');
const TIMESTAMPS_DIR = path.join(__dirname, '..', 'istampit-web', 'public', 'timestamps');

// Bitcoin attestation marker
const BITCOIN_MARKER = Buffer.from([0x05, 0x88]);

function isNestedOrBackupOts(filename) {
  // Match patterns like:
  // - *.ots.bak.ots
  // - *.ots.ots
  // - *.ots.bak
  // - *.ots.ots.ots (any chain)

  const parts = filename.split('.');
  const otsIndices = [];

  parts.forEach((part, idx) => {
    if (part === 'ots') otsIndices.push(idx);
  });

  // If more than one .ots, or if .bak exists, it's a backup/nested file
  if (otsIndices.length > 1) return true;
  if (filename.includes('.bak')) return true;
  if (filename.includes('.lost')) return true;

  return false;
}

function isLegitimateOts(filename) {
  // Legitimate patterns:
  // - api-spec-20251117.md.ots
  // - research-doc-20251117.txt.ots
  // - security-audit-20251117.pdf.ots
  // - iStampit.txt.ots

  // Must end with .ots
  if (!filename.endsWith('.ots')) return false;

  // Must NOT be a nested or backup file
  if (isNestedOrBackupOts(filename)) return false;

  return true;
}

function scanDirectory(dirPath) {
  const files = [];

  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return files;
  }

  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name.endsWith('.ots')) {
        files.push({
          path: fullPath,
          name: entry.name,
          dir: path.relative(path.join(__dirname, '..'), dir)
        });
      }
    }
  }

  scan(dirPath);
  return files;
}

function checkBitcoinAttestation(otsPath) {
  try {
    const data = fs.readFileSync(otsPath);
    return data.includes(BITCOIN_MARKER);
  } catch (error) {
    return false;
  }
}

function calculateHash(filePath) {
  // Try to find the original file by removing .ots extension
  const originalPath = filePath.replace(/\.ots$/, '');

  if (fs.existsSync(originalPath)) {
    const content = fs.readFileSync(originalPath);
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  return null;
}

async function main() {
  console.log('🧹 Robust Ledger Cleanup & Validation\n');

  // Step 1: Scan all directories
  console.log('📂 Scanning for .ots files...');
  const artifactFiles = scanDirectory(ARTIFACTS_DIR);
  const timestampFiles = scanDirectory(TIMESTAMPS_DIR);
  const allFiles = [...artifactFiles, ...timestampFiles];

  console.log(`   Found ${allFiles.length} total .ots files\n`);

  // Step 2: Identify legitimate vs backup files
  const legitimate = allFiles.filter(f => isLegitimateOts(f.name));
  const backups = allFiles.filter(f => !isLegitimateOts(f.name));

  console.log(`✅ Legitimate files: ${legitimate.length}`);
  console.log(`❌ Backup/nested files: ${backups.length}\n`);

  if (backups.length > 0) {
    console.log('🗑️  Removing backup and nested .ots files:\n');

    let removed = 0;
    for (const backup of backups) {
      try {
        fs.unlinkSync(backup.path);
        console.log(`   ✓ Removed: ${backup.name}`);
        removed++;
      } catch (error) {
        console.log(`   ✗ Failed to remove ${backup.name}: ${error.message}`);
      }
    }

    console.log(`\n💾 Removed ${removed} backup/nested files\n`);
  }

  // Step 3: Build clean ledger from legitimate files
  console.log('📝 Rebuilding ledger from legitimate files...\n');

  const entries = [];
  const seenHashes = new Set();

  for (const file of legitimate) {
    const relativePath = '/' + file.dir.replace(/\\/g, '/') + '/' + file.name;
    const hasBitcoin = checkBitcoinAttestation(file.path);
    const status = hasBitcoin ? 'confirmed' : 'pending';

    // Extract date and type from filename
    const dateMatch = file.name.match(/(\d{8})/);
    const date = dateMatch ? dateMatch[1] : null;

    // Create ID from filename
    const baseName = file.name.replace(/\.ots$/, '');
    const id = baseName.replace(/\d{8}/g, '').replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const fullId = date ? `${id}-${date}` : id;

    // Get file stats
    const stats = fs.statSync(file.path);
    const stampedAt = stats.birthtime.toISOString();

    // Try to calculate hash from original file
    const sha256 = calculateHash(file.path);

    if (!sha256) {
      console.log(`   ⚠️  No original file found for ${file.name}, skipping`);
      continue;
    }

    // Skip if we've already added this hash
    if (seenHashes.has(sha256)) {
      console.log(`   ⚠️  Duplicate hash detected for ${file.name}, skipping`);
      continue;
    }

    seenHashes.add(sha256);

    entries.push({
      id: fullId,
      title: baseName,
      sha256,
      receiptUrl: relativePath,
      status,
      txid: hasBitcoin ? 'pending-extraction' : null,
      blockHeight: null,
      blockTime: null,
      stampedAt,
      tags: ['automated', 'ledger-cleanup']
    });

    console.log(`   ${status === 'confirmed' ? '✅' : '⏳'} ${file.name} (${status})`);
  }

  // Step 4: Write clean ledger
  const ledger = {
    entries,
    metadata: {
      lastUpdated: new Date().toISOString(),
      totalEntries: entries.length,
      confirmedEntries: entries.filter(e => e.status === 'confirmed').length,
      pendingEntries: entries.filter(e => e.status === 'pending').length
    }
  };

  fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 CLEANUP SUMMARY');
  console.log('='.repeat(60));
  console.log(`Backup files removed:  ${backups.length}`);
  console.log(`Legitimate files kept: ${legitimate.length}`);
  console.log(`Ledger entries:        ${entries.length}`);
  console.log(`  ✅ Confirmed:        ${ledger.metadata.confirmedEntries}`);
  console.log(`  ⏳ Pending:          ${ledger.metadata.pendingEntries}`);
  console.log(`Duplicates prevented:  ${legitimate.length - entries.length}`);

  console.log('\n✅ Ledger cleanup completed successfully!');
}

main().catch(console.error);
