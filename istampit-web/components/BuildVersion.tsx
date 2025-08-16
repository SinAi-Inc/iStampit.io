// Server component to expose build/version metadata in the footer
// Attempts (in order): NEXT_PUBLIC_BUILD_VERSION, GIT_COMMIT_SHA, VERCEL_GIT_COMMIT_SHA, git rev-parse, package version
// Falls back to 'dev'.
import React from 'react';

function resolveBuildMeta(): { commit: string; version: string } {
  const envCommit = process.env.NEXT_PUBLIC_BUILD_VERSION
    || process.env.GIT_COMMIT_SHA
    || process.env.VERCEL_GIT_COMMIT_SHA
    || process.env.GITHUB_SHA;
  let commit = envCommit ? envCommit.substring(0, 12) : '';
  if (!commit) {
    try {
      const cp = require('node:child_process');
      commit = cp.execSync('git rev-parse --short=12 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch (_) { /* ignore */ }
  }
  let pkgVersion = '0.0.0';
  try {
    pkgVersion = require('../package.json').version || pkgVersion;
  } catch (_) { /* ignore */ }
  if (!commit) commit = 'dev';
  return { commit, version: pkgVersion };
}

export default function BuildVersion() {
  const { commit, version } = resolveBuildMeta();
  return (
    <p className="text-[10px] mt-4 text-gray-400 dark:text-gray-500 select-all" aria-label="Build version">
      build <code>{commit}</code> (v{version})
    </p>
  );
}
