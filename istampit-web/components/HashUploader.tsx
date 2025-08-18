"use client";
import React, { useState, useEffect, useRef } from 'react';
import { trackStampSuccess, trackStampError } from '../lib/analytics';
import { sha256Hex } from '../lib/sha256';
import { stampHash, base64ToBytes } from '../lib/apiClient';

interface Props {
  onHash: (hex: string) => void;
  /** When true, component will call backend to stamp the hash automatically */
  autoStamp?: boolean;
  /** Called when a receipt is fetched (autoStamp) */
  onReceipt?: (bytes: Uint8Array, meta: { hash: string; filename: string }) => void;
}

export default function HashUploader({ onHash, autoStamp=false, onReceipt }: Props) {
  const [busy, setBusy] = useState(false); // hashing or stamping
  const [manual, setManual] = useState('');
  const [stampStatus, setStampStatus] = useState<'idle'|'pending'|'success'|'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [lastMeta, setLastMeta] = useState<{hash:string; size:number; filename:string} | null>(null);
  const lastStampedHash = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function autoStampHash(hash: string){
    if(!autoStamp) return;
    if(!/^[0-9a-f]{64}$/.test(hash)) return;
    if (hash === lastStampedHash.current && stampStatus === 'success') return; // avoid duplicate
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStampStatus('pending');
    setMessage('Stamping…');
    try {
      const data = await stampHash(hash);
      const bytes = base64ToBytes(data.receiptB64);
      if(!bytes.length) throw new Error('decode_failed');
      // Trigger download
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = data.filename || `${hash}.ots`; document.body.appendChild(a); a.click(); a.remove();
      setStampStatus('success');
      setMessage('Receipt ready');
      setLastMeta({ hash, size: bytes.length, filename: data.filename || `${hash}.ots` });
      lastStampedHash.current = hash;
      onReceipt?.(bytes, { hash, filename: data.filename || `${hash}.ots` });
      trackStampSuccess(bytes.length);
      setTimeout(()=>{ setMessage(''); }, 4000);
    } catch(e:any){
      if(e.name === 'AbortError') return; // ignore
      setStampStatus('error');
      setMessage('Stamp failed');
      trackStampError(e?.message || 'stamp_failed');
      setTimeout(()=>{ setMessage(''); }, 5000);
    }
  }

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const hex = await sha256Hex(new Uint8Array(buf));
      onHash(hex);
      void autoStampHash(hex);
    } finally {
      setBusy(false);
    }
  }

  // When manual hash becomes valid, trigger auto stamp
  useEffect(()=>{
    if(autoStamp && /^[0-9a-f]{64}$/.test(manual.toLowerCase())){
      void autoStampHash(manual.toLowerCase());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manual, autoStamp]);

  return (
    <div className="space-y-3 border rounded-md p-4 bg-white">
      <div className="space-y-2">
        <label htmlFor="hash-file" className="block text-sm font-medium">Select File</label>
        <input
          id="hash-file"
          name="hash-file"
          type="file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
          disabled={busy}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">OR</span>
        <div className="flex-1" />
      </div>
      <div className="space-y-2">
        <label htmlFor="hash-manual" className="block text-sm font-medium">Paste SHA-256 (hex)</label>
        <input
          id="hash-manual"
          name="hash-manual"
          className={`w-full rounded px-2 py-1 text-sm border ${manual.length>0 && !/^[0-9a-fA-F]{64}$/.test(manual) ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'}`}
          placeholder="e3b0c442..."
          value={manual}
          aria-invalid={manual.length>0 && !/^[0-9a-fA-F]{64}$/.test(manual)}
          aria-describedby={manual.length>0 && !/^[0-9a-fA-F]{64}$/.test(manual) ? 'hash-manual-error' : undefined}
          onChange={(e) => {
            const val = e.target.value.trim();
            setManual(val);
            if (/^[0-9a-fA-F]{64}$/.test(val)) {
        const h = val.toLowerCase();
        onHash(h);
            }
          }}
        />
        {!/^[0-9a-fA-F]{64}$/.test(manual) && manual.length > 0 && (
          <p id="hash-manual-error" className="text-xs text-red-600" role="alert">Must be 64 hex chars.</p>
        )}
      </div>
      {busy && <p className="text-xs text-slate-500">Computing hash…</p>}
      {autoStamp && stampStatus === 'pending' && <p className="text-xs text-blue-600">Stamping hash…</p>}
      {autoStamp && stampStatus === 'success' && lastMeta && (
        <div className="text-xs text-green-600 space-y-1" role="status">
          <div>✅ {message} — <button onClick={()=>{
            // Re-offer open dialog
            if(lastMeta){
              // Not storing bytes; user already downloaded. Provide GET link.
              window.open(`/api/stamp/${lastMeta.hash}.ots`, '_blank');
            }
          }} className="underline text-green-700 hover:text-green-800">Open .ots</button></div>
          <div className="text-[10px] text-green-700 font-mono break-all">{lastMeta.hash.slice(0,16)}… • {lastMeta.size.toLocaleString()} bytes</div>
        </div>
      )}
      {autoStamp && stampStatus === 'error' && message && <p className="text-xs text-red-600" role="alert">❌ {message}</p>}
    </div>
  );
}
