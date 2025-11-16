"use client";
import React, { useEffect, useState } from 'react';
import LedgerTable from '../../components/LedgerTable';
import LedgerStatusChecker from '../../components/LedgerStatusChecker';
import { LedgerData, fetchLedger } from '../../lib/ledger';
import { trackLedgerView } from '../../lib/analytics';

export default function LedgerClient() {
  const [ledgerData, setLedgerData] = useState<LedgerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackLedgerView();
    fetchLedger()
      .then((data)=>{ setLedgerData(data); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading && !ledgerData && !error) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center animate-pulse text-gray-500">Loading Public Ledger...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-red-600">
            Error loading ledger: {error}
          </div>
        </div>
      </main>
    );
  }

  if (!ledgerData) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-600">
            No entries yet — be the first to stamp innovation 🚀
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-2">
            📖 Public Innovation Registry
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">Innovation Ledger</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Verifiable proof-of-existence for research & creative artifacts using OpenTimestamps on Bitcoin.
            Only cryptographic hashes are published — no intellectual property leakage.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{ledgerData.metadata.totalEntries.toLocaleString()}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium mt-2">Total Artifacts</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Timestamped innovations</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-green-200 dark:border-green-700 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{ledgerData.metadata.confirmedEntries.toLocaleString()}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium mt-2">✓ Confirmed</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Immutable on Bitcoin blockchain</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-yellow-200 dark:border-yellow-700 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{ledgerData.metadata.pendingEntries.toLocaleString()}</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium mt-2">⏳ Pending</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Awaiting Bitcoin block confirmation</div>
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <span role="img" aria-label="status">💡</span>
            Understanding Status
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700">
                  <span>✓</span> Confirmed
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Immutably recorded on Bitcoin blockchain.</strong> The timestamp is permanent and can be verified by anyone, anywhere, for free using the .ots receipt file.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
                • Bitcoin block height recorded<br/>
                • Verification is instant and free<br/>
                • Cannot be altered or deleted
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700">
                  <span>⏳</span> Pending
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Waiting for next Bitcoin block.</strong> The timestamp has been submitted to OpenTimestamps calendars and will be confirmed automatically (usually within 10-60 minutes).
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
                • No action required - happens automatically<br/>
                • No cost for confirmation<br/>
                • Will transition to "Confirmed" status
              </p>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <span role="img" aria-label="process">⚙️</span>
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-white dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
              <div className="text-3xl mb-3" role="img" aria-hidden="true">📦</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">1. Hash & Stamp</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Documents are hashed locally (SHA-256). Only the hash is submitted to OpenTimestamps calendars — never the source material.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-colors">
              <div className="text-3xl mb-3" role="img" aria-hidden="true">₿</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">2. Bitcoin Proof</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Calendars aggregate hashes into Bitcoin transactions. Each entry becomes part of the blockchain&apos;s immutable record.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-colors">
              <div className="text-3xl mb-3" role="img" aria-hidden="true">🔍</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">3. Independent Verification</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Anyone can verify timestamps using the OpenTimestamps protocol. Receipts (.ots files) prove existence at a specific time.
              </p>
            </div>
          </div>
        </div>

        {/* Manual Status Check */}
        {ledgerData.metadata.pendingEntries > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <span role="img" aria-label="update">⚡</span>
              Check Pending Confirmations
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
              There {ledgerData.metadata.pendingEntries === 1 ? 'is' : 'are'} <strong>{ledgerData.metadata.pendingEntries}</strong> pending {ledgerData.metadata.pendingEntries === 1 ? 'entry' : 'entries'} waiting for Bitcoin block confirmation.
              Click below to check if they've been confirmed on the blockchain.
            </p>
            <LedgerStatusChecker />
          </div>
        )}

        {/* Ledger Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Stamped Artifacts</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date(ledgerData.metadata.lastUpdated).toLocaleString()}
            </div>
          </div>
          <LedgerTable entries={ledgerData.entries} />
        </div>

        {/* Privacy Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700 p-6 rounded-xl">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2 text-lg">
            <span role="img" aria-label="security">🔒</span>
            Privacy & Security Guarantee
          </h3>
          <div className="space-y-2">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              This ledger publishes <strong>only cryptographic hashes (SHA-256)</strong> of artifacts — never the original files or content.
              Hashes cannot be reversed to reveal intellectual property. Each entry proves <em>existence</em> and <em>timestamp</em>
              without exposing sensitive information.
            </p>
            <div className="grid md:grid-cols-3 gap-3 mt-4 text-xs">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1">✓ Zero Knowledge</div>
                <div className="text-gray-700 dark:text-gray-300">Only SHA-256 hashes published</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1">✓ Free Verification</div>
                <div className="text-gray-700 dark:text-gray-300">No costs to verify timestamps</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1">✓ Immutable Proof</div>
                <div className="text-gray-700 dark:text-gray-300">Bitcoin blockchain permanence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>Last updated: {new Date(ledgerData.metadata.lastUpdated).toLocaleString()}</p>
          <p>
            Want to verify an artifact? Visit our <a href="/verify" className="text-blue-600 hover:text-blue-800">verification page</a> or
            use the <a href="https://github.com/SinAI-Inc/iStampit.io" className="text-blue-600 hover:text-blue-800">CLI tool</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
