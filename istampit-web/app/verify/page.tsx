"use client";
import { useState, useCallback } from 'react';
import HashUploader from '../../components/HashUploader';
import OtsVerifier, { VerificationResult } from '../../components/OtsVerifier';

export default function VerifyPage() {
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [receiptBytes, setReceiptBytes] = useState<Uint8Array | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleHash = useCallback((hash: string) => {
    setFileHash(hash);
    setResult(null);
  }, []);

  const handleReceipt = useCallback((bytes: Uint8Array) => {
    setReceiptBytes(bytes);
    setResult(null);
  }, []);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Provide Artifact (file OR SHA-256)</h2>
        <HashUploader onHash={handleHash} />
        {fileHash && (
          <p className="text-sm text-slate-600 break-all">Artifact SHA-256: <code>{fileHash}</code></p>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Load .ots Receipt</h2>
        <input
          type="file"
          accept=".ots"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const buf = new Uint8Array(await file.arrayBuffer());
            handleReceipt(buf);
          }}
        />
        {receiptBytes && (
          <p className="text-xs text-slate-600">Receipt loaded: {receiptBytes.length} bytes</p>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Verify</h2>
        <OtsVerifier
          fileHash={fileHash}
          receiptBytes={receiptBytes}
          onResult={(r) => {
            setResult(r);
            setError(r.error || null);
          }}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {result && !result.error && (
          <div className="border rounded-md p-4 bg-white space-y-2 text-sm">
            <div>
              Status: <span className="font-medium">{result.status}</span>
            </div>
            {result.calendarUrls.length > 0 && (
              <div>
                Calendars:
                <ul className="list-disc ml-6">
                  {result.calendarUrls.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.status === 'complete' && result.bitcoin && (
              <div>
                Bitcoin Block: <span className="font-medium">{result.bitcoin.blockHeight ?? 'n/a'}</span>{' '}
                {result.bitcoin.blockTime && (
                  <span className="text-slate-500">({new Date(result.bitcoin.blockTime * 1000).toISOString()})</span>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
