# Ledger Management Scripts

Robust automation for iStampit ledger maintenance and timestamp verification.

## Core Scripts

### 🔍 `validate-ledger.js`
**Purpose**: Validates ledger integrity and removes corrupt entries  
**When to run**: Every workflow run (automated), or manually after issues  
**What it does**:
- Removes entries for backup/nested `.ots` files (`.ots.bak`, `.ots.ots`)
- Removes entries for missing `.ots` files
- Removes duplicate SHA256 entries
- Updates Bitcoin confirmation status
- Validates all file references

```bash
node scripts/validate-ledger.js
```

**Output**:
- Clean ledger with only legitimate entries
- Statistics on removed/validated entries

---

### 📊 `update-ledger-status.js`
**Purpose**: Scans `.ots` files for Bitcoin attestations and updates status  
**When to run**: After timestamp upgrades, every 6 hours (automated)  
**What it does**:
- Reads all entries from `ledger.json`
- Checks each `.ots` file for Bitcoin attestation marker (`0x05 0x88`)
- Updates entry status from `pending` → `confirmed`
- Updates metadata counts

```bash
node scripts/update-ledger-status.js
```

---

### 🔄 `upgrade-pending-timestamps.js`
**Purpose**: Fetches Bitcoin attestations from OpenTimestamps calendar servers  
**When to run**: Every 6 hours (automated), or manually when timestamps are pending  
**What it does**:
- Queries 5 major OpenTimestamps calendar servers
- Downloads upgraded `.ots` files with Bitcoin attestations
- Updates files in place when upgrades are available
- Reports which timestamps were upgraded

```bash
node scripts/upgrade-pending-timestamps.js
```

**Calendar servers queried**:
- `a.pool.opentimestamps.org`
- `b.pool.opentimestamps.org`
- `alice.btc.calendar.opentimestamps.org`
- `bob.btc.calendar.opentimestamps.org`
- `finney.calendar.eternitywall.com`

---

### 🔄 `restamp-lost-timestamps.js`
**Purpose**: Re-creates timestamps that calendar servers lost (>3 days old, <200 bytes)  
**When to run**: Manually when timestamps don't upgrade after 3+ days  
**What it does**:
- Identifies timestamps >3 days old without Bitcoin attestations
- Backs up original `.ots` files as `.ots.lost`
- Submits SHA256 hashes to fresh calendar servers
- Updates `ledger.json` with new `stampedAt` times

```bash
node scripts/restamp-lost-timestamps.js
```

**Criteria for "lost" timestamps**:
- Age: >3 days (72 hours)
- File size: <200 bytes (indicates calendar-only, no Bitcoin)
- Status: Still `pending`

---

### 🧹 `cleanup-ledger.js`
**Purpose**: Removes specific entries by ID (legacy script)  
**When to run**: Manually to remove known bad entries  
**Status**: Deprecated - use `validate-ledger.js` instead

---

### 🗑️ `remove-orphaned-entries.js`
**Purpose**: Removes ledger entries for deleted `.ots` files (legacy script)  
**When to run**: Manually after deleting `.ots` files  
**Status**: Deprecated - use `validate-ledger.js` instead

---

## Automated Workflow

The ledger is maintained by `.github/workflows/ledger-update.yml` which runs **every 6 hours**:

1. ✅ **Validate ledger** - Remove backup file entries, duplicates
2. 🗑️ **Delete backup files** - Remove `*.ots.bak*`, `*.ots.ots*`, `*.ots.lost`
3. 🔄 **Upgrade timestamps** - Query calendar servers for Bitcoin attestations
4. 📊 **Update status** - Mark upgraded timestamps as confirmed
5. 📢 **Report results** - Display current ledger statistics

## Common Issues & Solutions

### Issue: Ledger shows 63+ entries instead of 18

**Cause**: Backup `.ots` files (`.ots.bak`, `.ots.ots`) were included in ledger

**Solution**:
```bash
# Run validation to clean ledger
node scripts/validate-ledger.js

# Remove backup files
find istampit-web/public -name "*.ots.bak*" -delete
find istampit-web/public -name "*.ots.ots*" -delete
```

---

### Issue: Timestamps stuck at "pending" for 3+ days

**Cause**: Calendar servers lost the timestamp submissions (404 responses)

**Solution**:
```bash
# Re-create lost timestamps
node scripts/restamp-lost-timestamps.js

# Wait 24 hours, then upgrade
node scripts/upgrade-pending-timestamps.js
```

---

### Issue: Duplicate entries with same SHA256

**Cause**: Ledger not validated before adding entries

**Solution**:
```bash
# Validation removes duplicates automatically
node scripts/validate-ledger.js
```

---

## File Naming Conventions

### ✅ Legitimate .ots files:
- `api-spec-20251117.md.ots` - Automated artifact
- `research-doc-20251117.txt.ots` - Automated artifact
- `iStampit.txt.ots` - Manual timestamp

### ❌ Backup/nested files (will be removed):
- `*.ots.bak` - Backup file
- `*.ots.bak.ots` - Nested backup
- `*.ots.ots` - Nested .ots
- `*.ots.ots.ots` - Multi-nested
- `*.ots.lost` - Backup from re-stamping

## Expected Ledger Size

**Target**: 18-25 entries
- 12 confirmed (Nov 17-20 automated timestamps)
- 3-6 pending (recent timestamps awaiting Bitcoin)
- 3 manual timestamps (brands: iStampit, EihDah, EDAAI)

**If you see 50+**: Run `validate-ledger.js` immediately - backup files polluted the ledger

## Bitcoin Confirmation Timeline

| Stage | Time | File Size | Status |
|-------|------|-----------|--------|
| Calendar submission | 0-1 hour | 117-200 bytes | `pending` |
| Calendar aggregation | 1-6 hours | 500-800 bytes | `pending` |
| Bitcoin inclusion | 6-24 hours | 2-5 KB | `confirmed` |
| Stuck (calendar lost it) | 72+ hours | <200 bytes | `pending` → re-stamp |

## Monitoring

### Live Dashboard
Visit `/ledger-live.html` for real-time status with auto-refresh every 30 seconds.

### Manual Check
```bash
node scripts/update-ledger-status.js
```

### Git Status
```bash
# Check if ledger was modified
git diff ledger.json
```

## Robustness Guarantees

1. ✅ **No duplicates**: SHA256 hash uniqueness enforced
2. ✅ **No backup files**: Removed automatically in workflow
3. ✅ **No orphaned entries**: Files validated before keeping entries
4. ✅ **Auto-upgrade**: Attempts every 6 hours
5. ✅ **Lost timestamp recovery**: Re-stamps files >3 days old
6. ✅ **Idempotent**: Scripts can be run multiple times safely

## Debugging

### Check file count
```bash
# Should be ~18-21 legitimate .ots files
find istampit-web/public -name "*.ots" | wc -l

# Count backup files (should be 0)
find istampit-web/public -name "*.ots.bak*" -o -name "*.ots.ots*" | wc -l
```

### Check ledger metadata
```bash
cat ledger.json | jq '.metadata'
```

### Find duplicates
```bash
cat ledger.json | jq -r '.entries[].sha256' | sort | uniq -d
```

---

**Last Updated**: 2025-11-22  
**Maintainer**: SinAI Inc  
**Status**: Production-ready
