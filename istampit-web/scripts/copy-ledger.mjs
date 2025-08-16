// copies ../../ledger.json -> public/ledger/index.json
import { mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..', '..');
const src = resolve(root, 'ledger.json');
const dstDir = resolve(__dirname, '..', 'public', 'ledger');
const dst = resolve(dstDir, 'index.json');

async function main() {
  if (!existsSync(src)) {
    console.warn(`[copy-ledger] ${src} not found; skipping.`);
    return;
  }
  await mkdir(dstDir, { recursive: true });
  await copyFile(src, dst);
  console.log(`[copy-ledger] Copied ${src} -> ${dst}`);
}
main().catch((e)=>{ console.error('[copy-ledger] Failed:', e); process.exit(1); });
