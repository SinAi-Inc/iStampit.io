#!/usr/bin/env node
// Cross-platform dev launcher honoring PORT env var (defaults to 3000)
const { spawn } = require('child_process');
const port = process.env.PORT || '3000';
const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'dev', '-p', port], { stdio: 'inherit' });
child.on('exit', code => process.exit(code));
