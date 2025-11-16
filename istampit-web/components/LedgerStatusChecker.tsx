"use client";
import React, { useState } from 'react';

interface StatusCheckerProps {
  onUpdate?: (result: { updated: number; checked: number }) => void;
}

export default function LedgerStatusChecker({ onUpdate }: StatusCheckerProps) {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ updated: number; checked: number; errors: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    setChecking(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ledger/update', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Update failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      onUpdate?.(data);

      // Reload page if entries were updated
      if (data.updated > 0) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleCheck}
        disabled={checking}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        aria-label="Check for Bitcoin confirmations"
      >
        <span className="text-base" role="img" aria-hidden="true">
          {checking ? '⏳' : '🔄'}
        </span>
        {checking ? 'Checking Bitcoin Blockchain...' : 'Check for Confirmations'}
      </button>

      {result && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 p-4 rounded-lg">
          <div className="font-medium text-green-800 dark:text-green-300 mb-1">
            ✓ Update Check Complete
          </div>
          <div className="text-sm text-green-700 dark:text-green-400">
            Checked {result.checked} pending entries
            {result.updated > 0 && (
              <div className="mt-1 font-semibold">
                🎉 {result.updated} entries confirmed on Bitcoin blockchain!
                <div className="text-xs mt-1">Page will reload automatically...</div>
              </div>
            )}
            {result.updated === 0 && (
              <div className="mt-1">No new confirmations yet. Bitcoin blocks arrive every ~10 minutes.</div>
            )}
          </div>
          {result.errors.length > 0 && (
            <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-400">
              Some entries had errors (check console for details)
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-4 rounded-lg">
          <div className="font-medium text-red-800 dark:text-red-300 mb-1">
            ✗ Update Failed
          </div>
          <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>💡 <strong>How it works:</strong> This checks pending OpenTimestamps receipts against Bitcoin blockchain to see if they've been confirmed.</p>
        <p className="mt-1">⚡ <strong>Cost:</strong> $0 - Verification is completely free using the decentralized OpenTimestamps protocol.</p>
      </div>
    </div>
  );
}
