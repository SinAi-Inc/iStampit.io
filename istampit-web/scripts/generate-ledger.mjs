// Splits root-level ledger.json into monthly segment files under public/ledger/YYYY/MM/index.json
// and writes the full copy to public/ledger/index.json for backward compatibility.
// Each monthly JSON: { entries: [...], metadata: { lastUpdated, totalEntries, confirmedEntries, pendingEntries, month, year } }
import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..', '..');
const ledgerPath = resolve(root, 'ledger.json');
const publicDir = resolve(__dirname, '..', 'public');
const ledgerOutDir = resolve(publicDir, 'ledger');

function monthKey(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  } catch {
    return null;
  }
}

async function writeJSON(path, data) {
  await fs.mkdir(dirname(path), { recursive: true });
  await fs.writeFile(path, JSON.stringify(data, null, 2));
}

async function generate() {
  if (!existsSync(ledgerPath)) {
    console.warn('[generate-ledger] ledger.json not found, skipping split.');
    return;
  }
  const raw = await fs.readFile(ledgerPath, 'utf8');
  let parsed;
  try { parsed = JSON.parse(raw); } catch (e) { throw new Error('Invalid ledger.json: ' + e.message); }
  const entries = Array.isArray(parsed.entries) ? parsed.entries : [];

  // Write full copy (legacy path)
  await writeJSON(resolve(ledgerOutDir, 'index.json'), parsed);

  const groups = new Map();
  for (const entry of entries) {
    const key = monthKey(entry.stampedAt);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }

  const nowISO = new Date().toISOString();
  for (const [key, group] of groups.entries()) {
    const [year, month] = key.split('-');
    const confirmed = group.filter(e => e.status === 'confirmed').length;
    const pending = group.filter(e => e.status === 'pending').length;
    const data = {
      entries: group,
      metadata: {
        lastUpdated: nowISO,
        totalEntries: group.length,
        confirmedEntries: confirmed,
        pendingEntries: pending,
        year: Number(year),
        month: Number(month)
      }
    };
    const outPath = resolve(ledgerOutDir, year, month, 'index.json');
    await writeJSON(outPath, data);
    console.log(`[generate-ledger] Wrote ${outPath} (${group.length} entries)`);
  }
  console.log(`[generate-ledger] Complete. Months: ${[...groups.keys()].sort().join(', ')}`);
}

generate().catch(err => { console.error('[generate-ledger] Failed:', err); process.exit(1); });
