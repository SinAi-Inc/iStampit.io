"use client";
import React from 'react';

/**
 * LedgerStatusChecker component - Shows automated update information
 * Note: For static GitHub Pages deployment, status updates happen automatically
 * via GitHub Actions workflow (every 6 hours). Manual API triggers are not
 * available on static sites.
 */
export default function LedgerStatusChecker() {
  return (
    <div className="space-y-3">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 p-4 rounded-lg">
        <div className="font-medium text-blue-800 dark:text-blue-300 mb-2">
          🤖 Automated Status Updates
        </div>
        <div className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
          <p>
            Ledger entries are automatically checked for Bitcoin blockchain confirmations <strong>every 6 hours</strong> via GitHub Actions.
          </p>
          <p>
            When a pending entry gets confirmed on Bitcoin (typically 10-60 minutes after stamping), 
            it will automatically update to "Confirmed" status in the next sync cycle.
          </p>
          <p className="pt-2 border-t border-blue-200 dark:border-blue-800">
            <strong>Next update:</strong> Within 6 hours • <strong>Cost:</strong> $0 (automated & free)
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
        <p>💡 <strong>How it works:</strong> Our GitHub Actions workflow checks pending OpenTimestamps receipts against the Bitcoin blockchain to detect new confirmations.</p>
        <p className="mt-1">⚡ <strong>Cost:</strong> $0 - Uses free GitHub Actions minutes and the decentralized OpenTimestamps protocol.</p>
        <p className="mt-1">🔍 <strong>Manual verification:</strong> You can always verify any receipt manually on the <a href="/verify" className="text-blue-600 dark:text-blue-400 hover:underline">Verify page</a>.</p>
      </div>
    </div>
  );
}
