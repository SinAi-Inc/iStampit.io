// Simple in-memory ledger placeholder. In real deployment replace with durable storage.
export interface LedgerEntry {
  id: string; // uuid or hash-derived identifier
  sha256: string;
  status: 'pending' | 'confirmed';
  firstSeen: number; // epoch seconds
  confirmedAt?: number; // epoch seconds
  blockHeight?: number;
  blockTime?: number;
  tags?: string[];
  proofPath?: string; // relative path/URL to .ots
}

const _entries: LedgerEntry[] = [];

export function addOrUpdate(entry: LedgerEntry) {
  const idx = _entries.findIndex(e => e.id === entry.id);
  if (idx >= 0) {
    _entries[idx] = { ..._entries[idx], ...entry };
  } else {
    _entries.push(entry);
  }
}

export function search(query: { hash?: string; status?: string; tag?: string }) {
  return _entries.filter(e => {
    if (query.hash && e.sha256 !== query.hash) return false;
    if (query.status && e.status !== query.status) return false;
    if (query.tag && !(e.tags || []).includes(query.tag)) return false;
    return true;
  });
}

export function list(): LedgerEntry[] { return [..._entries]; }
