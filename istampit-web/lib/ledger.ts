export interface LedgerEntry {
  id: string;
  title: string;
  sha256: string;
  receiptUrl: string;
  status: 'pending' | 'confirmed';
  txid: string | null;
  blockHeight: number | null;
  blockTime: number | null;
  stampedAt: string;
  tags: string[];
  // Verification tracking (optional, populated by user verification events)
  verified?: boolean;
  verifiedAt?: string;
  verificationCount?: number;
}

export interface LedgerData {
  entries: LedgerEntry[];
  metadata: {
    lastUpdated: string;
    totalEntries: number;
    confirmedEntries: number;
    pendingEntries: number;
  };
}

// For static public site we bundle the ledger JSON at build time. Dynamic deployments can still fetch.
export async function fetchLedger(): Promise<LedgerData> {
  // Strategy: prefer current month chunk (e.g. /ledger/2025-08.json) then fallback to root ledger.json
  const now = new Date();
  const ym = now.toISOString().slice(0,7); // YYYY-MM
  const monthlyUrl = `/ledger/${ym}.json`;
  const rootUrl = '/ledger.json';

  // Helper to load JSON via dynamic import (bundled) or network
  async function tryLoad(pathLike: string, publicUrl: string): Promise<LedgerData | null> {
    // Attempt bundler import only for root ledger.json (kept for backward compat)
    if (pathLike === '../../ledger.json') {
      try {
        // @ts-ignore dynamic import of JSON in root (copied at build time)
        const data = await import('../../ledger.json');
        if (data?.default) return computeMetadata(data.default as any);
      } catch {/* ignore */}
    }
    try {
      const res = await fetch(publicUrl, { cache: 'no-store' });
      if (!res.ok) return null;
      const raw = await res.json();
      return computeMetadata(raw);
    } catch { return null; }
  }

  // Try monthly first
  const monthly = await tryLoad('', monthlyUrl);
  if (monthly) return monthly;

  // Fallback to root
  const root = await tryLoad('../../ledger.json', rootUrl);
  if (root) return root;
  throw new Error('Failed to load ledger data');
}

function computeMetadata(raw: any): LedgerData {
  const entries: LedgerEntry[] = raw.entries || [];
  const confirmedEntries = entries.filter(e=>e.status==='confirmed').length;
  const pendingEntries = entries.filter(e=>e.status==='pending').length;
  const meta = raw.metadata || {};
  return {
    entries,
    metadata: {
      lastUpdated: meta.lastUpdated || new Date().toISOString(),
      totalEntries: entries.length,
      confirmedEntries,
      pendingEntries,
    }
  };
}

export function formatTimestamp(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}

export function formatBlockTime(unixTimestamp: number): string {
  return new Date(unixTimestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}

export function truncateHash(hash: string, length: number = 16): string {
  return `${hash.slice(0, length)}...${hash.slice(-8)}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
