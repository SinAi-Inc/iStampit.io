export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Documentation</h1>
        <p className="text-lg text-gray-600">
          Complete guide to using iStampit for innovation timestamping
        </p>
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
          <p className="text-gray-700">
            For sensitive files, you can verify using only the SHA-256 hash instead of uploading the full file.
            This ensures your private data never leaves your device.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Privacy Note:</strong> iStampit never stores your files or file contents.
              Only cryptographic hashes are processed for verification.
            </p>
          </div>
        </div>
      </section>

      {/* Stamping */}
      <section id="stamping" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">Creating Timestamps</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Manual Stamping</h3>
          <p className="text-gray-700">
            Currently, iStampit focuses on verification of existing .ots files. To create new timestamps:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Recommended Tools:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li><strong>OpenTimestamps Client:</strong> Official Python client for creating .ots files</li>
              <li><strong>ots-cli:</strong> Command-line tool for batch operations</li>
              <li><strong>Browser Extension:</strong> One-click stamping for web content</li>
            </ul>
          </div>

          <h3 className="text-xl font-medium">Automated Workflows</h3>
          <p className="text-gray-700">
            This repository includes GitHub Actions workflows for automated stamping of project milestones.
          </p>

          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Example: Daily stamping workflow
name: Stamp Innovation
on:
  schedule:
    - cron: '0 12 * * *'  # Daily at noon UTC

jobs:
  stamp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create timestamp
        run: |
          # Generate hash of current state
          git rev-parse HEAD > current-commit.txt
          # Create timestamp (requires OTS setup)
          ots stamp current-commit.txt`}
          </pre>
        </div>
      </section>

      {/* Innovation Ledger */}
      <section id="ledger" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">Innovation Ledger</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Public Registry</h3>
          <p className="text-gray-700">
            The Innovation Ledger is a public registry of timestamped innovations, providing transparency
            and attribution for creative and research work.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Ledger Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li><strong>Status Filtering:</strong> View confirmed vs pending timestamps</li>
              <li><strong>Copy Functions:</strong> Easy sharing of hashes and transaction IDs</li>
              <li><strong>Statistics:</strong> Track innovation velocity and confirmation rates</li>
              <li><strong>Privacy First:</strong> Only metadata and hashes, never file contents</li>
            </ul>
          </div>

          <h3 className="text-xl font-medium">Data Structure</h3>
          <p className="text-gray-700">
            Each ledger entry follows a standardized JSON schema for consistency and interoperability.
          </p>

          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`{
  "id": "unique-identifier",
  "title": "Innovation Title",
  "hash": "sha256-hash-of-content",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "confirmed|pending",
  "txid": "bitcoin-transaction-id",
  "blockHeight": 825000,
  "otsFile": "path/to/receipt.ots"
}`}
          </pre>
        </div>
      </section>

      {/* Embed Widget */}
      <section id="embed-basic" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">Embed Widget Integration</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Basic Setup</h3>
          <p className="text-gray-700">
            Add timestamp verification to any website with a single script tag and container div.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Include the Widget Script</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<script src="https://istampit.io/widget/v1.js" async></script>`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">2. Add Widget Container</h4>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<!-- Inline Mode: Direct embedding -->
<div data-istampit-verify
     data-mode="inline"
     data-theme="light">
</div>

<!-- Modal Mode: Click-to-open -->
<div data-istampit-verify
     data-mode="modal"
     data-theme="dark">
  <button>🔍 Verify with iStampit</button>
</div>`}
              </pre>
            </div>
          </div>

          <h3 className="text-xl font-medium">Configuration Options</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Attribute</th>
                  <th className="text-left py-2">Values</th>
                  <th className="text-left py-2">Description</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                <tr className="border-b">
                  <td className="py-2 font-mono">data-mode</td>
                  <td className="py-2">inline, modal</td>
                  <td className="py-2">Display mode for the widget</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">data-theme</td>
                  <td className="py-2">light, dark</td>
                  <td className="py-2">Color theme for the interface</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">data-src</td>
                  <td className="py-2">URL</td>
                  <td className="py-2">Custom verification page URL</td>
                </tr>
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
          <p className="text-gray-700">
            Listen for verification results and widget state changes using custom events.
          </p>

          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`// Listen for verification results
window.addEventListener('istampit-verified', (event) => {
  const {status, txid, blockHeight, hash} = event.detail;

  if (status === 'confirmed') {
    console.log('✅ Confirmed in block:', blockHeight);
    console.log('Transaction:', txid);
  } else if (status === 'pending') {
    console.log('⏳ Waiting for blockchain confirmation');
  } else {
    console.log('❌ Verification failed');
  }
});

// Listen for widget state changes
window.addEventListener('istampit-widget-ready', () => {
  console.log('🚀 Widget loaded and ready');
});

window.addEventListener('istampit-modal-opened', () => {
  console.log('📱 Modal verification opened');
});

window.addEventListener('istampit-modal-closed', () => {
  console.log('📱 Modal verification closed');
});`}
          </pre>

          <h3 className="text-xl font-medium">Programmatic Control</h3>
          <p className="text-gray-700">
            Create and control widgets programmatically for dynamic applications.
          </p>

          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`// Create widget programmatically
const widget = window.iStampit.createWidget({
  mode: 'modal',
  theme: 'light',
  container: document.getElementById('my-container')
});

// Open modal programmatically
widget.openModal();

// Set custom verification URL
widget.setSource('/custom-verify-page');`}
          </pre>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">Security & Privacy</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Privacy Guarantees</h3>
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
              <li><strong>No File Storage:</strong> Your files never leave your device</li>
              <li><strong>Hash-Only Processing:</strong> Only cryptographic fingerprints are used</li>
              <li><strong>No Tracking:</strong> No analytics, cookies, or user tracking</li>
              <li><strong>Open Source:</strong> All code is auditable and transparent</li>
            </ul>
          </div>

          <h3 className="text-xl font-medium">Widget Security</h3>
          <p className="text-gray-700">
            The embed widget uses modern security practices to protect both your site and users.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Security Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li><strong>Sandboxed iframes:</strong> Prevent XSS and code injection</li>
              <li><strong>CSP Compatible:</strong> Works with strict Content Security Policies</li>
              <li><strong>PostMessage API:</strong> Secure cross-origin communication</li>
              <li><strong>Input Validation:</strong> All data sanitized before processing</li>
            </ul>
          </div>

          <h3 className="text-xl font-medium">Verification Trust Model</h3>
          <p className="text-gray-700">
            Understanding the cryptographic guarantees and limitations of timestamp verification.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-blue-800">
              <strong>Trust Model:</strong> iStampit verification depends on the integrity of the
              Bitcoin blockchain and the OpenTimestamps protocol. No trust in iStampit.io servers
              is required - all proofs can be independently verified.
            </p>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshooting" className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">Troubleshooting</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Common Issues</h3>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-red-600 mb-2">❌ &ldquo;Invalid .ots file&rdquo; Error</h4>
              <p className="text-sm text-gray-700 mb-2">
                The uploaded .ots file is corrupted or not a valid OpenTimestamps receipt.
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Ensure the file has .ots extension</li>
                <li>Try re-downloading the receipt file</li>
                <li>Verify file wasn&apos;t corrupted during transfer</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-600 mb-2">⏳ &ldquo;Pending&rdquo; Status</h4>
              <p className="text-sm text-gray-700 mb-2">
                The timestamp is waiting for Bitcoin blockchain confirmation.
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Wait for next Bitcoin block (average 10 minutes)</li>
                <li>Check if the .ots file was recently created</li>
                <li>Verify using the official OpenTimestamps tools</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-red-600 mb-2">🚫 Widget Not Loading</h4>
              <p className="text-sm text-gray-700 mb-2">
                The embed widget script failed to load or initialize.
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Check browser console for JavaScript errors</li>
                <li>Verify script src URL is correct</li>
                <li>Ensure Content Security Policy allows iframe loading</li>
                <li>Try loading the widget after page load event</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-medium">Getting Help</h3>
          <p className="text-gray-700">
            Need additional support? Here are the best ways to get help:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li><strong>GitHub Issues:</strong> Report bugs or request features</li>
              <li><strong>Documentation:</strong> Check this page for detailed guides</li>
              <li><strong>OpenTimestamps:</strong> For protocol-level questions</li>
              <li><strong>Community:</strong> Join discussions about timestamping innovation</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
