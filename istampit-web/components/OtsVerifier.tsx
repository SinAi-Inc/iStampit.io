"use client";
import React, { useEffect, useState, useRef } from 'react';
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
	/** If true, hide manual verify button and present toast-style feedback automatically */
	autoVerify?: boolean;
}

export default function OtsVerifier({ fileHash, receiptBytes, onResult, autoVerify=false }: Props) {
	const [busy, setBusy] = useState(false);
	const [res, setRes] = useState<VerificationResult>({ status: 'idle', calendarUrls: [] });
		const [toast, setToast] = useState<{kind:'info'|'success'|'error'|'warn'; msg:string}|null>(null);
		const toastTimeout = useRef<number | undefined>(undefined);

	useEffect(() => {
		onResult?.(res);
		// Track verification result to API
		if (res.status === 'complete' || res.status === 'pending') {
			trackVerification(fileHash, res);
		}
	}, [res, onResult, fileHash]);

	const trackVerification = async (hash: string | null, result: VerificationResult) => {
		if (!hash || result.status === 'idle') return;
		try {
			await fetch('/api/ledger/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					hash,
					status: result.status === 'complete' ? 'confirmed' : 'pending',
					blockHeight: result.bitcoin?.blockHeight,
				}),
			});
		} catch (error) {
			// Silent fail - tracking shouldn't break UX
			console.debug('Verification tracking failed:', error);
		}
	};

	useEffect(() => {
		if (!fileHash || !receiptBytes) return;
		let cancelled = false;
		(async () => {
			setBusy(true);
				if(autoVerify){
					setToast({ kind:'info', msg:'Verifying…' });
				}
			try {
				const parsed = await verifyWithFallback(receiptBytes);
				if (!parsed.ok) {
					if (!cancelled) {
							setRes({ status: 'error', calendarUrls: [], error: parsed.error || 'Parse failed' });
							if(autoVerify) setToast({ kind:'error', msg:'Receipt invalid / parse failed' });
						}
					return;
				}
				if (parsed.fileHashHex && parsed.fileHashHex !== fileHash) {
					if (!cancelled) {
							setRes({ status: 'mismatch', calendarUrls: [], error: 'Artifact hash does not match receipt root hash.' });
							if(autoVerify) setToast({ kind:'error', msg:'❌ Mismatch: hash does not match receipt' });
						}
					return;
				}
				if (!cancelled) {
						setRes({ status: 'pending', calendarUrls: [] });
						if(autoVerify) setToast({ kind:'success', msg:'✅ Receipt verified (pending confirmations)' });
					}
			} catch (e: any) {
				if (!cancelled) {
						setRes({ status: 'error', calendarUrls: [], error: e?.message || String(e) });
						if(autoVerify) setToast({ kind:'error', msg:'Verification failed' });
					}
			} finally {
				if (!cancelled) setBusy(false);
			}
		})();
		return () => { cancelled = true; };
	}, [fileHash, receiptBytes, autoVerify]);

	// Auto-hide toast after delay
	useEffect(()=>{
		if(!toast) return;
		if(toastTimeout.current) window.clearTimeout(toastTimeout.current);
		toastTimeout.current = window.setTimeout(()=> setToast(null), toast.kind==='info'? 4000 : 5000);
		return ()=> { if(toastTimeout.current) window.clearTimeout(toastTimeout.current); };
	}, [toast]);

	return (
		<div className="space-y-3 relative">
			{!autoVerify && (
				<button
					disabled={busy || !fileHash || !receiptBytes}
					onClick={() => {
						if (fileHash && receiptBytes) {
							setRes({ status: 'idle', calendarUrls: [] });
							setTimeout(() => setRes(r => ({ ...r })), 0);
						}
					}}
					className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50"
					title={busy? 'Verifying…': undefined}
				>
					{busy ? 'Verifying…' : 'Verify'}
				</button>
			)}
			{autoVerify && busy && <p className="text-xs text-slate-500">Verifying…</p>}
			{res.status !== 'idle' && (
				<p className="text-xs text-slate-500">Result: {res.status}</p>
			)}
			{autoVerify && toast && (
				<div
					className={`text-xs px-3 py-2 rounded border max-w-xs shadow-sm ${toast.kind==='error'?'bg-red-50 border-red-200 text-red-700': toast.kind==='success' ? 'bg-green-50 border-green-200 text-green-700': toast.kind==='warn' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}
					role={toast.kind==='error' ? 'alert':'status'}
					aria-live="polite"
				>
					{toast.msg}
				</div>
			)}
		</div>
	);
}
