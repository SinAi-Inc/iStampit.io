"use client";
import React, { useState } from 'react';
import { sha256Hex } from '../lib/sha256';

interface Props {
  onHash: (hex: string) => void;
}

export default function HashUploader({ onHash }: Props) {
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState('');

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const hex = await sha256Hex(new Uint8Array(buf));
      onHash(hex);
    } finally {
      setBusy(false);
    }
  }

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
              onHash(val.toLowerCase());
            }
          }}
        />
        {!/^[0-9a-fA-F]{64}$/.test(manual) && manual.length > 0 && (
          <p id="hash-manual-error" className="text-xs text-red-600" role="alert">Must be 64 hex chars.</p>
        )}
      </div>
      {busy && <p className="text-xs text-slate-500">Computing hash…</p>}
    </div>
  );
}
