export default function EmbedDemo() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Embed Widget</h1>
        <p className="text-lg text-gray-600">
          Add timestamp verification to your site with one script tag and a div.
        </p>
      </div>

      {/* Integration Guide */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Quick Integration</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">1. Add the script tag</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<script src="https://istampit.io/widget/v1.js" async></script>`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">2. Add a widget container</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<!-- Inline widget -->
<div data-istampit-verify
     data-mode="inline"
     data-theme="light">
</div>

<!-- Modal widget -->
<div data-istampit-verify
     data-mode="modal"
     data-theme="light">
  <button>Verify with iStampit</button>
</div>`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">3. Listen for results (optional)</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<script>
window.addEventListener('istampit-verified', (e) => {
  console.log('Verification result:', e.detail);
  // {status: 'confirmed'|'pending'|'invalid', txid, blockHeight, hash}
});
</script>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Live Demos */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Live Demos</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Inline Widget</h3>
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
              <div
                data-istampit-verify=""
                data-mode="inline"
                data-theme="light"
                data-src="/verify"
                style={{minHeight: '400px', background: '#f9fafb', borderRadius: '8px'}}
              >
                <div className="flex items-center justify-center h-full text-gray-500">
                  Widget will load here when script is active
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Modal Widget</h3>
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
              <div
                data-istampit-verify=""
                data-mode="modal"
                data-theme="light"
                data-src="/verify"
              >
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                  🔍 Verify with iStampit (Demo)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Widget Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">🛡️ Security & Privacy</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Sandboxed iframe prevents XSS</li>
              <li>• Only hashes verified, never file content</li>
              <li>• No tracking or analytics</li>
              <li>• CSP-friendly implementation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">⚙️ Customization</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Light/dark theme support</li>
              <li>• Inline or modal display modes</li>
              <li>• Auto-resize to content height</li>
              <li>• PostMessage event communication</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
