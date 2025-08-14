"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { useRemoteSession } from '../../lib/remoteSession';
import HashUploader from '../../components/HashUploader';
import OtsVerifier, { VerificationResult } from '../../components/OtsVerifier';
import { trackVerifyStarted, trackVerifyResult, trackVerifyError, trackWidgetLoad } from '../../lib/analytics';
import { ExplorerManager } from '../../lib/explorer';
import { deriveAllowedOrigin } from '../../lib/embedSecurity';

export default function VerifyClient() {
  const { session, status, signIn } = useRemoteSession();
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

  // Loading state
  if (status === 'loading') {
    return (
      <div className={containerClass}>
        <div className="p-6 text-center text-sm text-gray-600 dark:text-gray-300 animate-pulse">
          Checking authentication…
        </div>
      </div>
    );
  }

  // Unauthenticated gate
  if (status === 'unauthenticated') {
    const IS_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';
  const externalAuthHref = `https://auth.istampit.io/api/auth/signin?callbackUrl=${encodeURIComponent('https://istampit.io/verify')}`;
    const staticModeNote = IS_STATIC && (
      <p className="text-[11px] text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-1">
        You are viewing the static demo. Sign-in opens the live app and returns here.
      </p>
    );
    return (
      <div className={containerClass}>
        <div className={isEmbed ? 'p-4 space-y-4 border rounded bg-white shadow-sm' : 'mx-auto max-w-xl p-8 space-y-6 border rounded-lg bg-white shadow'}>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Sign In Required</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You need to sign in to use the verification feature. Browsing the site is open, but verifying hashes / receipts requires an account.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            {IS_STATIC ? (
              <a
                href={externalAuthHref}
                className="btn-primary w-full justify-center text-center"
                rel="noopener noreferrer"
              >
                Continue with Google
              </a>
            ) : (
              <button onClick={() => signIn('/verify')} className="btn-primary w-full justify-center">
                Continue with Google
              </button>
            )}
            <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-sm text-center leading-relaxed">
              We only use your email to link verifications and improve abuse prevention. Your files & receipts never leave your device.
            </p>
            {staticModeNote}
          </div>
          {isEmbed && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-2 rounded">
              This verifier is embedded. If the sign-in popup is blocked, open <a href="/verify" target="_blank" className="underline">/verify</a> directly.
            </p>
          )}
        </div>
        <div className="text-center text-xs text-gray-400 pt-4">Verification tools hidden until sign-in.</div>
      </div>
    );
  }

  // Authenticated UI
  return (
    <div className={containerClass}>
      {!isEmbed && (
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Verify OpenTimestamps Receipt</h1>
          <p className="text-gray-600">Upload your file and .ots receipt to verify timestamp proof</p>
        </div>
      )}

      <section className="space-y-4">
        <h2 className={headingClass}>
          {isEmbed ? "File or SHA-256" : "1. Provide Artifact (file OR SHA-256)"}
        </h2>
        <HashUploader onHash={handleHash} />
        {fileHash && (
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-sm text-gray-700 break-all font-mono">
              SHA-256: {fileHash}
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(fileHash)}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
            >
              Copy SHA-256
            </button>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className={headingClass}>
          {isEmbed ? "Upload .ots Receipt" : "2. Load .ots Receipt"}
        </h2>
        <div className="space-y-2">
          <label htmlFor="ots-receipt" className="block text-sm font-medium">Select .ots Receipt</label>
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
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {receiptBytes && (
            <p className="text-xs text-gray-600">
              Receipt loaded: {receiptBytes.length.toLocaleString()} bytes
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={headingClass}>
          {isEmbed ? "Verification" : "3. Verify"}
        </h2>
        <OtsVerifier
          fileHash={fileHash}
          receiptBytes={receiptBytes}
          onResult={handleResult}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
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
          <div className="border rounded-md p-4 bg-white space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                result.status === 'complete'
                  ? 'bg-green-100 text-green-800'
                  : result.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.status === 'complete' ? 'Confirmed on Bitcoin' :
                 result.status === 'pending' ? 'Pending confirmation' :
                 result.status === 'mismatch' ? 'File/receipt mismatch' : 'Invalid receipt'}
              </span>
            </div>

            {result.calendarUrls.length > 0 && (
              <div>
                <span className="font-medium">Calendars:</span>
                <ul className="list-disc ml-6 mt-1">
                  {result.calendarUrls.map((u) => (
                    <li key={u} className="text-blue-600 break-all">{u}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.status === 'complete' && result.bitcoin && (
              <div className="bg-green-50 p-3 rounded">
                <div className="font-medium text-green-800 mb-2">
                  ✅ Verified on Bitcoin Block #{result.bitcoin.blockHeight ?? 'unknown'}
                </div>
                {result.bitcoin.blockTime && (
                  <div className="text-sm text-green-700 mb-3">
                    📅 {new Date(result.bitcoin.blockTime * 1000).toLocaleString()}
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-green-700">Transaction ID:</span>
                  <code className="text-xs bg-white px-2 py-1 rounded font-mono">
                    mock-txid-{result.bitcoin?.blockHeight}
                  </code>
                  <button
                    onClick={() => navigator.clipboard?.writeText(`mock-txid-${result.bitcoin?.blockHeight || 'unknown'}`)}
                    className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                    title="Copy transaction ID"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  {ExplorerManager.getEnabledExplorers().map((explorer, index) => (
                    <div key={explorer.name} className="flex items-center">
                      {index > 0 && <span className="text-gray-400 mr-2">•</span>}
                      <a
                        href={result.bitcoin?.blockHeight
                          ? `${explorer.baseUrl}${explorer.blockPath}${result.bitcoin.blockHeight}`
                          : '#'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
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

      <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm">
        <div className="text-blue-900 font-medium">🔒 Privacy First</div>
        <div className="text-blue-800 mt-1">
          We publish and verify hashes only. Your files never leave your device.
        </div>
      </div>
    </div>
  );
}
