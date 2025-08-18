"use client";
import React from 'react';
import Link from 'next/link';

export default function DocsClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Documentation</h1>
        <p className="text-lg text-gray-600">Complete guide to using iStampit for innovation timestamping</p>
      </div>

      {/* Quick Navigation */}
      <section className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Getting Started</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#verification" className="text-blue-600 hover:underline">File Verification</a></li>
              <li><a href="#stamping" className="text-blue-600 hover:underline">Creating Timestamps</a></li>
              <li><a href="#ledger" className="text-blue-600 hover:underline">Innovation Ledger</a></li>
              <li><a href="#security" className="text-blue-600 hover:underline">Security & Privacy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3">Integration</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#embed-basic" className="text-blue-600 hover:underline">Embed Widget Setup</a></li>
              <li><a href="#embed-api" className="text-blue-600 hover:underline">JavaScript API</a></li>
              <li><a href="#workflows" className="text-blue-600 hover:underline">CI/CD Workflows</a></li>
              <li><a href="#troubleshooting" className="text-blue-600 hover:underline">Troubleshooting</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* File Verification */}
      <section id="verification" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">File Verification</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-medium">How It Works</h3>
          <p className="text-gray-700">
            iStampit uses the OpenTimestamps protocol to create cryptographic proofs of when your files existed.
            These proofs are anchored to the Bitcoin blockchain, providing immutable timestamps that anyone can verify.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Verification Process:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Upload your original file + .ots receipt file</li>
              <li>System computes SHA-256 hash of your file</li>
              <li>Receipt is verified against Bitcoin blockchain</li>
              <li>Status shown: Confirmed (in blockchain) or Pending (waiting for inclusion)</li>
            </ol>
          </div>
          <h3 className="text-xl font-medium">Hash-Only Verification</h3>
          <p className="text-gray-700">For sensitive files, you can verify using only the SHA-256 hash instead of uploading the full file.</p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Privacy Note:</strong> iStampit never stores your files or file contents. Only cryptographic hashes are processed.
            </p>
          </div>
        </div>
      </section>

      {/* Stamping */}
      <section id="stamping" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">Creating Timestamps</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Web Interface (Recommended)</h3>
          <p className="text-gray-700">iStampit provides a free, easy-to-use web interface for creating timestamps:</p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
              <Link href="/stamp" className="hover:underline">Create Timestamp Page</Link>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li><strong>Upload files:</strong> Drag & drop any file for automatic SHA-256 hashing and stamping</li>
              <li><strong>Paste hashes:</strong> Enter a 64-character SHA-256 hash directly</li>
              <li><strong>Instant receipts:</strong> Get your .ots file immediately after stamping</li>
              <li><strong>Privacy-first:</strong> Files are hashed locally; only the hash is transmitted</li>
            </ul>
          </div>

          <h3 className="text-xl font-medium">API Integration</h3>
          <p className="text-gray-700">For developers integrating timestamping into applications:</p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">POST /api/stamp</h4>
            <pre className="text-sm text-gray-700 dark:text-gray-300 mb-2"><code>{`{
  "hash": "64-character-hex-sha256"
}`}</code></pre>
            <p className="text-xs text-gray-600 dark:text-gray-400">Returns a base64-encoded .ots receipt file. Rate limited to 60 requests per minute per IP.</p>
          </div>

          <h3 className="text-xl font-medium">Command Line Tools</h3>
          <p className="text-gray-700">For power users and automation workflows:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">istampit-cli (Our Package):</h4>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto mb-2"><code>{`pip install istampit-cli
istampit stamp --hash <sha256> --out receipt.ots`}</code></pre>
            <h4 className="font-medium mb-2 mt-4">OpenTimestamps Official:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li><strong>OpenTimestamps Client:</strong> Official Python client for creating .ots files</li>
              <li><strong>ots-cli:</strong> Command-line tool for batch operations</li>
              <li><strong>Browser Extension:</strong> One-click stamping for web content</li>
            </ul>
          </div>

          <h3 className="text-xl font-medium">Automated Workflows</h3>
          <p className="text-gray-700">Use CI/CD workflows for automated stamping of project milestones.</p>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">{`# Example: Daily stamping workflow
name: Stamp Innovation
on:
  schedule:
    - cron: '0 12 * * *'

jobs:
  stamp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create timestamp
        run: |
          git rev-parse HEAD > current-commit.txt
          # Using iStampit API
          HASH=$(sha256sum current-commit.txt | cut -d' ' -f1)
          curl -X POST https://api.istampit.io/stamp \\
            -H "Content-Type: application/json" \\
            -d "{\\"hash\\":\\"$HASH\\"}" > receipt.json`}</pre>
        </div>
      </section>

      {/* Innovation Ledger */}
      <section id="ledger" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">Innovation Ledger</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Public Registry</h3>
          <p className="text-gray-700">The Innovation Ledger is a public registry of timestamped innovations.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Ledger Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Status filtering (confirmed vs pending)</li>
              <li>Copy hashes & transaction IDs</li>
              <li>Confirmation statistics</li>
              <li>Privacy-first metadata only</li>
            </ul>
          </div>
          <h3 className="text-xl font-medium">Data Structure</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">{`{\n  "id": "unique-identifier",\n  "title": "Innovation Title",\n  "hash": "sha256-hash",\n  "timestamp": "2024-01-15T10:30:00Z",\n  "status": "confirmed|pending",\n  "txid": "bitcoin-txid",\n  "blockHeight": 825000,\n  "otsFile": "receipt.ots"\n}`}</pre>
        </div>
      </section>

      {/* Embed Widget */}
      <section id="embed-basic" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">Embed Widget Integration</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Basic Setup</h3>
          <p className="text-gray-700">Add timestamp verification to any website with a script tag and container div.</p>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Include the Script</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">{`<script src="https://istampit.io/widget/v1.js" async></script>`}</pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. Add Container</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">{`<!-- Inline Mode -->\n<div data-istampit-verify data-mode="inline" data-theme="light"></div>\n\n<!-- Modal Mode -->\n<div data-istampit-verify data-mode="modal" data-theme="dark">\n  <button>🔍 Verify with iStampit</button>\n</div>`}</pre>
            </div>
          </div>
          <h3 className="text-xl font-medium">Configuration</h3>
          <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Attribute</th>
                  <th className="text-left py-2">Values</th>
                  <th className="text-left py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 font-mono">data-mode</td><td className="py-2">inline, modal</td><td className="py-2">Display style</td></tr>
                <tr className="border-b"><td className="py-2 font-mono">data-theme</td><td className="py-2">light, dark</td><td className="py-2">Color scheme</td></tr>
                <tr className="border-b"><td className="py-2 font-mono">data-src</td><td className="py-2">URL</td><td className="py-2">Custom verify page</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* JavaScript API */}
      <section id="embed-api" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">JavaScript API</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Event Handling</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">{`window.addEventListener('istampit-verified', (e) => {\n  const {status, txid, blockHeight, hash} = e.detail;\n  console.log('Result:', status, txid, blockHeight, hash);\n});`}</pre>
          <h3 className="text-xl font-medium">Programmatic Control</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">{`const widget = window.iStampit.createWidget({\n  mode: 'modal',\n  theme: 'light'\n});\nwidget.openModal();`}</pre>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">Security & Privacy</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Privacy Guarantees</h3>
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
              <li>No file storage</li>
              <li>Hash-only processing</li>
              <li>No tracking/analytics</li>
              <li>Open source transparency</li>
            </ul>
          </div>
          <h3 className="text-xl font-medium">Trust Model</h3>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-800">
            Proofs rely on Bitcoin blockchain + OpenTimestamps. All receipts independently verifiable.
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshooting" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">Troubleshooting</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-red-600 mb-2">❌ Invalid .ots file</h4>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>File corrupted or not a receipt</li>
              <li>Re-download the receipt</li>
              <li>Verify extension is .ots</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-600 mb-2">⏳ Pending Status</h4>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Awaiting next Bitcoin block (~10m)</li>
              <li>Recent receipt not yet aggregated</li>
              <li>Check with official OTS tools</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-red-600 mb-2">🚫 Widget Not Loading</h4>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Console errors present</li>
              <li>Script URL incorrect</li>
              <li>CSP blocking iframe/script</li>
              <li>Delay initialization until load</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Getting Help</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>GitHub Issues for bugs/features</li>
              <li>OpenTimestamps community for protocol</li>
              <li>Public discussions for ideas</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
