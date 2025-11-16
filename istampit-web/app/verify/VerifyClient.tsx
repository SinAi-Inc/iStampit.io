"use client";
import React, { useState, useCallback, useEffect } from 'react';
import HashUploader from '../../components/HashUploader';
import OtsVerifier, { VerificationResult } from '../../components/OtsVerifier';
import { trackVerifyStarted, trackVerifyResult, trackVerifyError, trackWidgetLoad } from '../../lib/analytics';
import { ExplorerManager } from '../../lib/explorer';
import { deriveAllowedOrigin } from '../../lib/embedSecurity';

export default function VerifyClient() {
  // Session no longer required for public verification; future optional enhancements can re-introduce.
  const status: 'authenticated' | 'unauthenticated' | 'loading' = 'authenticated';
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [receiptBytes, setReceiptBytes] = useState<Uint8Array | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEmbed, setIsEmbed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const notifyParent = useCallback((result: VerificationResult) => {
    if (!isEmbed || typeof window === 'undefined') return;
    const payload = {
      type: 'istampit:verify:result',
      status: result.status === 'complete' ? 'confirmed' :
              result.status === 'pending' ? 'pending' : 'invalid',
      txid: result.bitcoin?.blockHeight ? 'mock-txid' : null,
      blockHeight: result.bitcoin?.blockHeight || null,
      hash: fileHash || null,
    };
    if (window.parent && window.parent !== window) {
      const allowedOrigin = (window as any)._istampitAllowedOrigin;
      if (allowedOrigin) {
        window.parent.postMessage(payload, allowedOrigin);
      }
    }
  }, [isEmbed, fileHash]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const embedMode = params.get('embed') === '1';
    const themeParam = params.get('theme') as 'light' | 'dark' | null;
    const paramOrigin = params.get('origin');
    const e2eMode = params.get('e2e') === '1';
    setIsEmbed(embedMode);
    if (themeParam && ['light', 'dark'].includes(themeParam)) {
      setTheme(themeParam);
    }
    if (embedMode) {
      document.body.className = `embed-mode theme-${themeParam || 'light'}`;
      const allowed = deriveAllowedOrigin({ paramOrigin, referrer: document.referrer });
      if (allowed) {
        (window as any)._istampitAllowedOrigin = allowed;
      }
      const mode = (params.get('mode') === 'modal') ? 'modal' : 'inline';
      try { trackWidgetLoad(mode as any); } catch {/* noop */}
      if (allowed && window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'istampit:ready' }, allowed);
      }
      // E2E hook for simulating a verification result without performing real OTS verification
      if (e2eMode) {
        (window as any).__istampitSimulateResult = () => {
          const mock: VerificationResult = {
            status: 'complete',
            calendarUrls: ['https://calendar.opentimestamps.org'],
            bitcoin: { blockHeight: 123456, blockTime: Math.floor(Date.now()/1000) },
            error: undefined
          } as any;
            notifyParent(mock);
        };
      }
    }
  }, [notifyParent]);


  const postHeight = useCallback(() => {
    if (!isEmbed || typeof window === 'undefined') return;
    const height = document.documentElement.scrollHeight;
    if (window.parent && window.parent !== window) {
      const allowedOrigin = (window as any)._istampitAllowedOrigin;
      if (allowedOrigin) {
        window.parent.postMessage({
          type: 'istampit:ui:height',
          height
        }, allowedOrigin);
      }
    }
  }, [isEmbed]);

  useEffect(() => {
    if (!isEmbed || typeof window === 'undefined') return;
    setTimeout(postHeight, 100);
    const resizeObserver = new ResizeObserver(postHeight);
    resizeObserver.observe(document.body);
    return () => resizeObserver.disconnect();
  }, [isEmbed, postHeight]);

  const handleHash = useCallback((hash: string) => {
    setFileHash(hash);
    setResult(null);
    trackVerifyStarted();
    setTimeout(postHeight, 100);
  }, [postHeight]);

  const handleReceipt = useCallback((bytes: Uint8Array) => {
    setReceiptBytes(bytes);
    setResult(null);
    setTimeout(postHeight, 100);
  }, [postHeight]);

  const handleResult = useCallback((r: VerificationResult) => {
    setResult(r);
    setError(r.error || null);
    if (r.error) {
      const reason = r.error.includes('mismatch') ? 'mismatch' :
                    r.error.includes('invalid') || r.error.includes('corrupt') ? 'corrupt' :
                    r.error.includes('calendar') || r.error.includes('network') ? 'network' : 'other';
      trackVerifyError(reason);
    } else {
      const status = r.status === 'complete' ? 'confirmed' :
                    r.status === 'pending' ? 'pending' : 'invalid';
      trackVerifyResult(status);
    }
    notifyParent(r);
    setTimeout(postHeight, 100);
  }, [notifyParent, postHeight]);

  const containerClass = isEmbed
    ? "space-y-6 p-4 max-w-2xl mx-auto"
    : "space-y-8";

  const headingClass = isEmbed
    ? "text-lg font-semibold"
    : "text-xl font-semibold";

  // Public verification UI (always shown)
  return (
    <div className={containerClass}>
      {!isEmbed && (
        <div className="text-center space-y-4 mb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
            <span className="text-2xl" role="img" aria-hidden="true">🔍</span>
            <span className="text-sm font-medium text-green-800 dark:text-green-300">Verify Your Timestamps</span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Verify OpenTimestamps Receipt
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-base leading-relaxed">
            Verify your document's Bitcoin-anchored timestamp in three simple steps. 
            Drop your file, upload the <code className="font-mono bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">*.ots</code> receipt, 
            and confirm authenticity instantly. 
            <span className="block mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
              🔒 100% private - everything happens in your browser
            </span>
          </p>
        </div>
      )}

      {/* Step 1: Provide Artifact */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
            1
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {isEmbed ? "File or SHA-256" : "Provide Your File"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload your file or paste its SHA-256 hash to begin verification
            </p>
          </div>
        </div>

        <HashUploader
          onHash={handleHash}
          autoStamp
          onReceipt={(bytes, meta) => {
            handleReceipt(bytes);
          }}
        />
        
        <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">💡</span>
          <p>
            <strong>Pro tip:</strong> Paste a 64-character SHA-256 hash directly into the input field, or drag & drop your file for automatic hashing.
          </p>
        </div>

        {fileHash && (
          <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
              <span className="font-medium text-green-800 dark:text-green-300 text-sm">Hash Generated</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">SHA-256 Hash:</p>
              <p className="text-sm text-gray-900 dark:text-gray-100 break-all font-mono leading-relaxed">
                {fileHash}
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(fileHash);
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors"
            >
              📋 Copy Hash
            </button>
          </div>
        )}
      </section>

      {/* Step 2: Upload Receipt */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
            2
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {isEmbed ? "Upload .ots Receipt" : "Upload Your Receipt"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select the OpenTimestamps receipt file (*.ots) that was generated when you timestamped your document
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label 
            htmlFor="ots-receipt" 
            className="block relative group cursor-pointer"
          >
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to select .ots receipt file
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    or drag and drop it here
                  </p>
                </div>
              </div>
            </div>
            <input
              id="ots-receipt"
              name="ots-receipt"
              type="file"
              accept=".ots"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const buf = new Uint8Array(await file.arrayBuffer());
                  handleReceipt(buf);
                } catch (err) {
                  setError('Failed to read .ots file. Please try again.');
                }
              }}
              className="sr-only"
            />
          </label>
          
          {receiptBytes && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-purple-600 dark:text-purple-400 text-lg">✓</span>
                <span className="font-medium text-purple-800 dark:text-purple-300 text-sm">Receipt Loaded</span>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-400">
                <span className="font-mono">{receiptBytes.length.toLocaleString()}</span> bytes • Ready for verification
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Step 3: Verify */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
            3
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {isEmbed ? "Verification" : "Verify Your Timestamp"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verification happens automatically once you provide both the file and receipt
            </p>
          </div>
        </div>
        
        <OtsVerifier
          fileHash={fileHash}
          receiptBytes={receiptBytes}
          onResult={handleResult}
          autoVerify
        />

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 dark:border-red-600 p-4 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div className="flex-1">
                <div className="font-semibold text-red-800 dark:text-red-300 mb-2">Verification Error</div>
                <div className="text-sm text-red-700 dark:text-red-400">
                  {error.includes('mismatch') ? (
                    <>
                      <strong>File/Receipt Mismatch:</strong> The uploaded file doesn&apos;t match the .ots receipt.
                      Make sure you&apos;re using the correct original file that was timestamped.
                    </>
                  ) : error.includes('invalid') || error.includes('corrupt') ? (
                    <>
                      <strong>Invalid .ots File:</strong> The receipt file appears to be corrupted or not a valid OpenTimestamps file.
                      Try re-downloading the .ots receipt.
                    </>
                  ) : error.includes('calendar') || error.includes('network') ? (
                    <>
                      <strong>Calendar Unavailable:</strong> Your receipt stays valid; the timestamp servers are temporarily unreachable.
                      Try again later.
                    </>
                  ) : (
                    <>{error}</>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {result && !result.error && (
          <div className="space-y-4 mt-4">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Verification Status:</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                result.status === 'complete'
                  ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                  : result.status === 'pending'
                  ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700'
                  : 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
              }`}>
                {result.status === 'complete' && '✅'}
                {result.status === 'pending' && '⏳'}
                {result.status !== 'complete' && result.status !== 'pending' && '❌'}
                <span>
                  {result.status === 'complete' ? 'Confirmed on Bitcoin' :
                   result.status === 'pending' ? 'Pending Confirmation' :
                   result.status === 'mismatch' ? 'File/Receipt Mismatch' : 'Invalid Receipt'}
                </span>
              </span>
            </div>

            {/* Calendar Info */}
            {result.calendarUrls.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-3 rounded-lg">
                <div className="font-medium text-blue-800 dark:text-blue-300 mb-2 text-sm">Calendar Servers Used:</div>
                <ul className="space-y-1">
                  {result.calendarUrls.map((u) => (
                    <li key={u} className="text-xs text-blue-700 dark:text-blue-400 font-mono break-all">
                      • {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bitcoin Confirmation Details */}
            {result.status === 'complete' && result.bitcoin && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 p-5 rounded-xl shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-800/40 flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-900 dark:text-green-200 text-lg">
                      Verified on Bitcoin
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-400">
                      Your timestamp is permanently recorded on the Bitcoin blockchain
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Block Info */}
                  <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Block Height:</span>
                      <span className="text-lg font-bold text-green-700 dark:text-green-400">
                        #{result.bitcoin.blockHeight ?? 'unknown'}
                      </span>
                    </div>
                    {result.bitcoin.blockTime && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>📅</span>
                        <span>{new Date(result.bitcoin.blockTime * 1000).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Transaction ID */}
                  <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Transaction ID:</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-100 dark:bg-gray-900/50 px-3 py-2 rounded font-mono text-gray-800 dark:text-gray-200 break-all">
                        mock-txid-{result.bitcoin?.blockHeight}
                      </code>
                      <button
                        onClick={() => navigator.clipboard?.writeText(`mock-txid-${result.bitcoin?.blockHeight || 'unknown'}`)}
                        className="flex-shrink-0 px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-colors"
                        title="Copy transaction ID"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>

                  {/* Explorer Links */}
                  <div className="flex flex-wrap gap-2">
                    {ExplorerManager.getEnabledExplorers().map((explorer, index) => (
                      <a
                        key={explorer.name}
                        href={result.bitcoin?.blockHeight
                          ? `${explorer.baseUrl}${explorer.blockPath}${result.bitcoin.blockHeight}`
                          : '#'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800/50 hover:bg-green-50 dark:hover:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 transition-all shadow-sm hover:shadow"
                      >
                        <span>{index === 0 ? '🔍' : '📊'}</span>
                        <span>View on {explorer.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Privacy Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center">
            <span className="text-xl">🔒</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1">100% Private & Secure</div>
            <div className="text-sm text-blue-800 dark:text-blue-300">
              We publish and verify <strong>hashes only</strong>. Your files never leave your device. 
              All verification happens in your browser using open-source cryptography.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
