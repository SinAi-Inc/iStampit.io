"use client";
import { useState } from 'react';
import HashUploader from '../../components/HashUploader';
import ApiStatus from '../../components/ApiStatus';

export default function StampClient() {
  const [currentHash, setCurrentHash] = useState<string>('');
  const [recentStamps, setRecentStamps] = useState<Array<{hash: string; filename: string; timestamp: number}>>([]);
  const [showCurlCommand, setShowCurlCommand] = useState(false);

  const handleNewStamp = (bytes: Uint8Array, meta: { hash: string; filename: string }) => {
    setRecentStamps(prev => [
      { hash: meta.hash, filename: meta.filename, timestamp: Date.now() },
      ...prev.slice(0, 9) // Keep last 10
    ]);
  };

  const copyCurlCommand = (hash: string) => {
    const command = `curl -X POST "https://istampit-api.fly.dev/stamp" \\
  -H "Content-Type: application/json" \\
  -d '{"hash":"${hash}"}'`;

    navigator.clipboard.writeText(command).then(() => {
      // Could add a toast notification here
      console.log('Curl command copied to clipboard');
    });
  };

  const generateExampleCurl = () => {
    const exampleHash = currentHash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    return `curl -X POST "https://istampit-api.fly.dev/stamp" \\
  -H "Content-Type: application/json" \\
  -d '{"hash":"${exampleHash}"}'`;
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
              🚀 Free Blockchain Timestamping
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Create Immutable{" "}
              <span className="gradient-text">Proof of Existence</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Generate a cryptographic timestamp receipt proving your document existed at this moment in time.
              Anchored in Bitcoin blockchain using OpenTimestamps - free forever.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className="text-green-500">✓</span> Privacy-first (only hashes processed)
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-500">✓</span> Instant download
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-500">✓</span> Bitcoin-secured
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-500">✓</span> Verifiable anywhere
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Stamping Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Upload File or Enter Hash
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Drop any file to compute its SHA-256 hash and create a timestamp receipt,
                    or paste a precomputed hash directly.
                  </p>
                </div>

                <HashUploader
                  onHash={setCurrentHash}
                  autoStamp={true}
                  onReceipt={handleNewStamp}
                />

                {currentHash && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Current Document Hash
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">SHA-256:</p>
                      <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                        {currentHash}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      💡 Save this hash with your records - you&apos;ll need it to verify the timestamp later.
                    </p>
                  </div>
                )}
              </div>

              {/* How it Works */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  How Timestamping Works
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Local Hashing</p>
                        <p className="text-gray-600 dark:text-gray-300">Your file is hashed (SHA-256) on your device. The original never uploads.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Submit Hash</p>
                        <p className="text-gray-600 dark:text-gray-300">Only the hash is sent to OpenTimestamps calendars.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Bitcoin Proof</p>
                        <p className="text-gray-600 dark:text-gray-300">Calendars create a Bitcoin transaction with your hash.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Get Receipt</p>
                        <p className="text-gray-600 dark:text-gray-300">Download your .ots file - mathematical proof of existence.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* API Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Service Status
                </h3>
                <ApiStatus />
              </div>

              {/* Recent Stamps */}
              {recentStamps.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Stamps
                  </h3>
                  <div className="space-y-3">
                    {recentStamps.map((stamp, i) => (
                      <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(stamp.timestamp).toLocaleTimeString()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyCurlCommand(stamp.hash)}
                              className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                              title="Copy curl command"
                            >
                              curl
                            </button>
                            <a
                              href={`/api/stamp/${stamp.hash}.ots`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                        <p className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">
                          {stamp.hash.slice(0, 16)}...{stamp.hash.slice(-8)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* API Developer Tools */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Developer Tools
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API curl Command
                    </label>
                    <div className="relative">
                      <pre className="bg-gray-100 dark:bg-gray-700 text-xs p-3 rounded-lg overflow-x-auto font-mono text-gray-800 dark:text-gray-200">
{generateExampleCurl()}
                      </pre>
                      <button
                        onClick={() => navigator.clipboard.writeText(generateExampleCurl())}
                        className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Replace the hash with your SHA-256. Rate limit: 60/min per IP.
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What&apos;s Next?
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400">📥</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Save your receipt</p>
                      <p className="text-gray-600 dark:text-gray-300">Keep the .ots file safe with your original document</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400">🔍</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Verify anytime</p>
                      <p className="text-gray-600 dark:text-gray-300">Use our verify page to check your timestamp</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400">📋</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Track progress</p>
                      <p className="text-gray-600 dark:text-gray-300">Check the Innovation Ledger for Bitcoin confirmation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
