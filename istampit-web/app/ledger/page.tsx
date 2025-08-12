"use client";
import React, { useEffect, useState } from 'react';
import LedgerTable from '../../components/LedgerTable';
import { LedgerData, fetchLedger } from '../../lib/ledger';
import { trackLedgerView } from '../../lib/analytics';

export default function LedgerPage() {
  const [ledgerData, setLedgerData] = useState<LedgerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackLedgerView(); // Track page view
    fetchLedger()
      .then(setLedgerData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading Innovation Ledger...</div>
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
          <div className="text-center">No ledger data available.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Innovation Ledger</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Verifiable proof-of-existence for research & creative artifacts using OpenTimestamps on Bitcoin.
            Only cryptographic hashes are published — no intellectual property leakage.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{ledgerData.metadata.totalEntries}</div>
              <div className="text-gray-500">Total Artifacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{ledgerData.metadata.confirmedEntries}</div>
              <div className="text-gray-500">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{ledgerData.metadata.pendingEntries}</div>
              <div className="text-gray-500">Pending</div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">1. Hash & Stamp</h3>
              <p className="text-gray-600">
                Documents are hashed locally (SHA-256). Only the hash is submitted to OpenTimestamps calendars — never the source material.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">2. Bitcoin Proof</h3>
              <p className="text-gray-600">
                Calendars aggregate hashes into Bitcoin transactions. Each entry becomes part of the blockchain&apos;s immutable record.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">3. Independent Verification</h3>
              <p className="text-gray-600">
                Anyone can verify timestamps using the OpenTimestamps protocol. Receipts (.ots files) prove existence at a specific time.
              </p>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Stamped Artifacts</h2>
          <LedgerTable entries={ledgerData.entries} />
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">🔒 Privacy & Security</h3>
          <p className="text-blue-800 text-sm">
            This ledger publishes only cryptographic hashes (SHA-256) of artifacts — never the original files or content.
            Hashes cannot be reversed to reveal intellectual property. Each entry proves <em>existence</em> and <em>timestamp</em>
            without exposing sensitive information.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>Last updated: {new Date(ledgerData.metadata.lastUpdated).toLocaleString()}</p>
          <p>
            Want to verify an artifact? Visit our <a href="/verify" className="text-blue-600 hover:text-blue-800">verification page</a> or
            use the <a href="https://github.com/SinAi-Inc/iStampit.io" className="text-blue-600 hover:text-blue-800">CLI tool</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
