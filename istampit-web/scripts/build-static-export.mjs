#!/usr/bin/env node

import { spawn } from 'child_process';
import { createRequire } from 'module';
import { mkdir, rename, rm } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const workspaceDir = process.cwd();
const routeDir = path.join(workspaceDir, 'app', 'api', 'stamp');
const backupRoot = path.join(workspaceDir, '.tmp', 'static-export');
const backupDir = path.join(backupRoot, 'stamp');
const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const require = createRequire(import.meta.url);
const nextCli = require.resolve('next/dist/bin/next');

let moved = false;

async function moveRouteOutOfApp() {
  if (process.env.STATIC_EXPORT !== '1' || !existsSync(routeDir)) {
    return;
  }
  await mkdir(backupRoot, { recursive: true });
  await rm(backupDir, { recursive: true, force: true });
  await rename(routeDir, backupDir);
  moved = true;
  console.log('[static-export] Moved app/api/stamp out of app router for export build');
}

async function restoreRoute() {
  if (!moved || !existsSync(backupDir)) {
    return;
  }
  await mkdir(path.dirname(routeDir), { recursive: true });
  await rm(routeDir, { recursive: true, force: true });
  await rename(backupDir, routeDir);
  await rm(backupRoot, { recursive: true, force: true });
  moved = false;
  console.log('[static-export] Restored app/api/stamp after export build');
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: workspaceDir,
      stdio: 'inherit',
      env: process.env,
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

try {
  await moveRouteOutOfApp();
  await runCommand(npmBin, ['run', 'prebuild']);
  await runCommand(process.execPath, [nextCli, 'build']);
} finally {
  await restoreRoute();
}
