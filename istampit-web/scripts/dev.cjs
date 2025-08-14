#!/usr/bin/env node
// Cross-platform dev launcher honoring PORT env var (defaults to 3000)
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || '3000';
const binDir = path.join(process.cwd(), 'node_modules', '.bin');
let nextBin = path.join(binDir, process.platform === 'win32' ? 'next.cmd' : 'next');
if (!fs.existsSync(nextBin)) {
	// Fallback: try node_modules/next/dist/bin/next
	const alt = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
	if (fs.existsSync(alt)) nextBin = process.execPath, process.argv.splice(2,0,alt); // fallback to node executing the script
}
const args = nextBin === process.execPath ? ['dev','-p',port] : ['dev','-p',port];
const cmd = nextBin;
const child = spawn(cmd, args, { stdio: 'inherit', env: process.env, shell: process.platform === 'win32' });
child.on('exit', code => process.exit(code ?? 0));
