// Prebuild step: purge build artifacts & regenerate ledger split files.
import { rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const webRoot = resolve(__dirname, '..');

async function safeRm(path) {
  try { await rm(path, { recursive: true, force: true }); console.log('[prebuild] Removed', path); }
  catch (e) { console.warn('[prebuild] Skip remove', path, e.message); }
}

function run(script) {
  return new Promise((res, rej) => {
    const cp = spawn(process.execPath, [script], { stdio: 'inherit' });
    cp.on('exit', code => code === 0 ? res() : rej(new Error(script + ' exited with ' + code)));
  });
}

async function main() {
  await safeRm(resolve(webRoot, '.next'));
  await safeRm(resolve(webRoot, 'out'));
  await run(resolve(webRoot, 'scripts', 'generate-ledger.mjs'));
}

main().catch(e => { console.error('[prebuild] Failed:', e); process.exit(1); });
