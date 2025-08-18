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
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Verify OpenTimestamps Receipt</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm">
            Drop a file, paste a SHA-256 hash, and load its <code className="font-mono bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">.ots</code> receipt to confirm a Bitcoin‑anchored timestamp. Nothing leaves your browser.
          </p>
        </div>
      )}

      <section className="space-y-4">
        <h2 className={`${headingClass} text-gray-900 dark:text-white`}>
          {isEmbed ? "File or SHA-256" : "1. Provide Artifact (file OR SHA-256)"}
        </h2>
  <HashUploader
    onHash={handleHash}
    autoStamp
    onReceipt={(bytes, meta) => {
      handleReceipt(bytes);
      // Optionally could track analytics here later with meta.hash/meta.filename
    }}
  />
  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">Tip: You can paste a 64‑char SHA‑256 hash directly; drag & drop also supported.</p>
        {fileHash && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 break-all font-mono">
              SHA-256: {fileHash}
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(fileHash)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-1"
            >
              Copy SHA-256
            </button>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className={`${headingClass} text-gray-900 dark:text-white`}>
          {isEmbed ? "Upload .ots Receipt" : "2. Load .ots Receipt"}
        </h2>
        <div className="space-y-2">
          <label htmlFor="ots-receipt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select .ots Receipt</label>
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
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
          />
          {receiptBytes && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Receipt loaded: {receiptBytes.length.toLocaleString()} bytes
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={`${headingClass} text-gray-900 dark:text-white`}>
          {isEmbed ? "Verification" : "3. Verify"}
        </h2>
        <OtsVerifier
          fileHash={fileHash}
          receiptBytes={receiptBytes}
          onResult={handleResult}
          autoVerify
        />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            <div className="font-medium mb-1">❌ Verification Error</div>
            <div className="text-sm">
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
        )}

        {result && !result.error && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-gray-300">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                result.status === 'complete'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : result.status === 'pending'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
              }`}>
                {result.status === 'complete' ? 'Confirmed on Bitcoin' :
                 result.status === 'pending' ? 'Pending confirmation' :
                 result.status === 'mismatch' ? 'File/receipt mismatch' : 'Invalid receipt'}
              </span>
            </div>

            {result.calendarUrls.length > 0 && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Calendars:</span>
                <ul className="list-disc ml-6 mt-1">
                  {result.calendarUrls.map((u) => (
                    <li key={u} className="text-blue-600 dark:text-blue-400 break-all">{u}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.status === 'complete' && result.bitcoin && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                <div className="font-medium text-green-800 dark:text-green-300 mb-2">
                  ✅ Verified on Bitcoin Block #{result.bitcoin.blockHeight ?? 'unknown'}
                </div>
                {result.bitcoin.blockTime && (
                  <div className="text-sm text-green-700 dark:text-green-400 mb-3">
                    📅 {new Date(result.bitcoin.blockTime * 1000).toLocaleString()}
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-green-700 dark:text-green-400">Transaction ID:</span>
                  <code className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded font-mono text-gray-800 dark:text-gray-200">
                    mock-txid-{result.bitcoin?.blockHeight}
                  </code>
                  <button
                    onClick={() => navigator.clipboard?.writeText(`mock-txid-${result.bitcoin?.blockHeight || 'unknown'}`)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    title="Copy transaction ID"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  {ExplorerManager.getEnabledExplorers().map((explorer, index) => (
                    <div key={explorer.name} className="flex items-center">
                      {index > 0 && <span className="text-gray-400 dark:text-gray-500 mr-2">•</span>}
                      <a
                        href={result.bitcoin?.blockHeight
                          ? `${explorer.baseUrl}${explorer.blockPath}${result.bitcoin.blockHeight}`
                          : '#'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                      >
                        {index === 0 ? '🔍' : '📊'} View on {explorer.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded text-sm">
        <div className="text-blue-900 dark:text-blue-300 font-medium">🔒 Privacy First</div>
        <div className="text-blue-800 dark:text-blue-400 mt-1">
          We publish and verify hashes only. Your files never leave your device.
        </div>
      </div>
    </div>
  );
}
