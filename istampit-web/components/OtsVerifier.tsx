"use client";
import React, { useEffect, useState } from 'react';
import { verifyWithFallback } from '../lib/ots-lite';

export interface VerificationResult {
	status: 'idle' | 'mismatch' | 'pending' | 'complete' | 'error';
	calendarUrls: string[];
	bitcoin?: { blockHeight?: number; blockTime?: number };
	error?: string;
}

interface Props {
	fileHash: string | null;
	receiptBytes: Uint8Array | null;
	onResult?: (r: VerificationResult) => void;
}

export default function OtsVerifier({ fileHash, receiptBytes, onResult }: Props) {
	const [busy, setBusy] = useState(false);
	const [res, setRes] = useState<VerificationResult>({ status: 'idle', calendarUrls: [] });

	useEffect(() => {
		onResult?.(res);
	}, [res, onResult]);

	useEffect(() => {
		if (!fileHash || !receiptBytes) return;
		let cancelled = false;
		(async () => {
			setBusy(true);
			try {
				const parsed = await verifyWithFallback(receiptBytes);
				if (!parsed.ok) {
					if (!cancelled) setRes({ status: 'error', calendarUrls: [], error: parsed.error || 'Parse failed' });
					return;
				}
				if (parsed.fileHashHex && parsed.fileHashHex !== fileHash) {
					if (!cancelled) setRes({ status: 'mismatch', calendarUrls: [], error: 'Artifact hash does not match receipt root hash.' });
					return;
				}
				if (!cancelled) setRes({ status: 'pending', calendarUrls: [] });
			} catch (e: any) {
				if (!cancelled) setRes({ status: 'error', calendarUrls: [], error: e?.message || String(e) });
			} finally {
				if (!cancelled) setBusy(false);
			}
		})();
		return () => { cancelled = true; };
	}, [fileHash, receiptBytes]);

	return (
		<div className="space-y-3">
			<button
				disabled={busy || !fileHash || !receiptBytes}
				onClick={() => {
					if (fileHash && receiptBytes) {
						setRes({ status: 'idle', calendarUrls: [] });
						setTimeout(() => setRes(r => ({ ...r })), 0);
					}
				}}
				className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50"
			>
				{busy ? 'Verifying…' : 'Verify'}
			</button>
			{res.status !== 'idle' && (
				<p className="text-xs text-slate-500">Result: {res.status}</p>
			)}
		</div>
	);
}
