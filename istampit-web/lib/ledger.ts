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

export async function fetchLedger(): Promise<LedgerData> {
  const response = await fetch('/ledger.json');
  if (!response.ok) {
    throw new Error(`Failed to fetch ledger: ${response.status}`);
  }
  return response.json();
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
