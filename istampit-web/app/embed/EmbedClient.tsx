"use client";
import React from 'react';

export default function EmbedClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Embed Widget</h1>
        <p className="text-lg text-gray-600">Add timestamp verification with one script tag.</p>
      </div>

      {/* Integration Guide */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Quick Integration</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">1. Script Tag</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">{`<!-- Use versioned + SRI snippet (see /widget/sri-snippet.html) -->\n<script src="https://istampit.io/widget/v1.js" integrity="sha256-..." crossorigin="anonymous" async></script>`}</pre>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">2. Container</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">{`<!-- Light Theme -->\n<div data-istampit-verify data-mode="inline" data-theme="light"></div>\n\n<!-- Dark Theme -->\n<div data-istampit-verify data-mode="inline" data-theme="dark"></div>\n\n<!-- Modal Mode -->\n<div data-istampit-verify data-mode="modal" data-theme="dark">\n  <button>Verify with iStampit</button>\n</div>`}</pre>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">3. Listen for Messages (optional)</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">{`// Parent page example\nwindow.addEventListener('message', (e) => {\n  if (e.origin !== 'https://istampit.io' && !e.origin.endsWith('.istampit.io')) return;\n  if (e.data?.type === 'istampit:ready') {\n    console.log('Widget ready');\n  } else if (e.data?.type === 'istampit:verify:result') {\n    console.log('Verification result:', e.data);\n  } else if (e.data?.type === 'istampit:ui:height') {\n    // Resize container if desired\n  }\n});`}</pre>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">4. Security</h3>
            <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
              <li>postMessage restricted to validated HTTPS origin (?origin= or referrer allowlist).</li>
              <li>No wildcard communication; invalid origin blocks messages.</li>
              <li>Use SRI integrity + versioned filename for supply-chain protection.</li>
              <li>Only hashes processed; files never leave device.</li>
            </ul>
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
              <div data-istampit-verify data-mode="inline" data-theme="light" data-src="/verify" style={{minHeight:'400px',background:'#f9fafb',borderRadius:'8px'}}>
                <div className="flex items-center justify-center h-full text-gray-500">Widget loads here</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Modal Widget</h3>
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
              <div data-istampit-verify data-mode="modal" data-theme="light" data-src="/verify">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">🔍 Verify with iStampit (Demo)</button>
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
              <li>Sandboxed iframe</li>
              <li>Hash-only verification</li>
              <li>No tracking</li>
              <li>CSP friendly</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">⚙️ Customization</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Light/dark theme</li>
              <li>Inline or modal</li>
              <li>Auto-resize</li>
              <li>PostMessage events</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
