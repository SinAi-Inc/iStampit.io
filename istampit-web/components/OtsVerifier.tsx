"use client";
import React, { useEffect, useState } from 'react';

// Lazy import to avoid SSR issues
async function loadOts() {
	const mod = await import('opentimestamps');
	return mod as any;
}

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
		let abort = false;
		(async () => {
			setBusy(true);
			try {
				const ots = await loadOts();
				const { DetachedTimestampFile, OpSHA256 } = ots;
				// Build a detached timestamp file for the provided artifact hash for potential future upgrade use.
				const artifactBytes = new Uint8Array(fileHash.match(/.{2}/g)!.map((h: string) => parseInt(h, 16)));
				const artifactDTF = new DetachedTimestampFile(new OpSHA256(), artifactBytes);
				const receipt = DetachedTimestampFile.deserialize(receiptBytes);
				const receiptRootHex = Array.from(receipt.fileHash() as Uint8Array).map((b) => (b as number).toString(16).padStart(2, '0')).join('');
				if (receiptRootHex !== fileHash) {
					setRes({ status: 'mismatch', calendarUrls: [], error: 'Artifact hash does not match receipt root hash.' });
					return;
				}
				// Attempt to merge receipt timestamp into constructed artifact for potential use later
				try { artifactDTF.timestamp = receipt.timestamp; } catch { /* ignore */ }
				// Collect calendar URLs (timestamps operations referencing calendars)
				const calendars: string[] = [];
				try {
					const ts = receipt.timestamp; // underlying Timestamp
					if (ts && ts.attestations) {
						for (const att of ts.attestations) {
							if (att.url && !calendars.includes(att.url)) calendars.push(att.url);
						}
					}
				} catch (_) {
					/* ignore */
				}
				// Attempt to find a bitcoin block attestation
				let bitcoin: VerificationResult['bitcoin'];
				let status: VerificationResult['status'] = 'pending';
				try {
					const ts = receipt.timestamp;
					if (ts && ts.attestations) {
						for (const att of ts.attestations) {
							if (att.type && /bitcoin/i.test(att.type)) {
								status = 'complete';
								bitcoin = { blockHeight: att.height, blockTime: att.blockTime || att.time }; // heuristic
								break;
							}
						}
					}
				} catch (_) {
					/* swallow */
				}
				if (!abort) setRes({ status, calendarUrls: calendars, bitcoin });
			} catch (e: any) {
				if (!abort) setRes({ status: 'error', calendarUrls: [], error: e?.message || String(e) });
			} finally {
				if (!abort) setBusy(false);
			}
		})();
		return () => {
			abort = true;
		};
	}, [fileHash, receiptBytes]);

	return (
		<div className="space-y-3">
			<button
				disabled={busy || !fileHash || !receiptBytes}
				onClick={() => {
					// retrigger effect by mutating state references
					if (fileHash && receiptBytes) {
						setRes({ status: 'idle', calendarUrls: [] });
						// slight delay to allow effect to re-run
						setTimeout(() => setRes((r) => ({ ...r })), 0);
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
