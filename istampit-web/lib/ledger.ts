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
  // Attempt static import first (works in Next.js bundler for JSON in project root copied to public at build step)
  try {
    // @ts-ignore - using dynamic import hint; adjust path if ledger.json relocated
    const data = await import('../../ledger.json');
    if (data && data.default) {
      return computeMetadata(data.default as any);
    }
  } catch (_) {
    // Fallback to runtime fetch (e.g., dynamic server environment)
  }
  const response = await fetch('/ledger.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to fetch ledger: ${response.status}`);
  const raw = await response.json();
  return computeMetadata(raw);
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
