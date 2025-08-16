"use client";
import React, { useState } from 'react';
import { LedgerEntry, truncateHash, formatTimestamp, formatBlockTime, copyToClipboard } from '../lib/ledger';
import { trackLedgerFilter } from '../lib/analytics';

interface Props {
  entries: LedgerEntry[];
}

export default function LedgerTable({ entries }: Props) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [searchTag, setSearchTag] = useState('');

  const filteredEntries = entries.filter(entry => {
    if (filter !== 'all' && entry.status !== filter) return false;
    if (searchTag && !entry.tags.some((tag: string) => tag.toLowerCase().includes(searchTag.toLowerCase()))) return false;
    return true;
  });

  const allTags = Array.from(new Set(entries.flatMap(e => e.tags))).sort();

  const handleCopyHash = async (hash: string) => {
    try {
      await copyToClipboard(hash);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy hash:', err);
    }
  };

  const handleCopyTxid = async (txid: string) => {
    try {
      await copyToClipboard(txid);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy txid:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          {(['all', 'pending', 'confirmed'] as const).map(status => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                trackLedgerFilter(status); // Track filter usage
              }}
              className={`px-3 py-1 rounded text-sm ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="ledger-tag-filter" className="sr-only">Filter by tag</label>
          <input
            id="ledger-tag-filter"
            name="ledger-tag-filter"
            type="text"
            placeholder="Filter by tag..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="px-3 py-1 border rounded text-sm"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-600">
        Showing {filteredEntries.length} of {entries.length} entries
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded overflow-hidden">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">SHA-256</th>
              <th className="p-3">Status</th>
              <th className="p-3">Bitcoin</th>
              <th className="p-3">Tags</th>
              <th className="p-3">Stamped</th>
              <th className="p-3">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{entry.title}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleCopyHash(entry.sha256)}
                    className="font-mono text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                    title="Click to copy full hash"
                  >
                    {truncateHash(entry.sha256)}
                  </button>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    entry.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.status}
                  </span>
                </td>
                <td className="p-3">
                  {entry.status === 'confirmed' && entry.blockHeight && entry.txid ? (
                    <div className="space-y-1">
                      <div className="text-xs">Block {entry.blockHeight.toLocaleString()}</div>
                      {entry.blockTime && (
                        <div className="text-xs text-gray-500">
                          {formatBlockTime(entry.blockTime)}
                        </div>
                      )}
                      <button
                        onClick={() => handleCopyTxid(entry.txid!)}
                        className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                        title="Click to copy TXID"
                      >
                        {entry.txid.slice(0, 8)}...
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Pending</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-xs text-gray-600">
                  {formatTimestamp(entry.stampedAt)}
                </td>
                <td className="p-3">
                  <a
                    href={entry.receiptUrl}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download .ots
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          {entries.length === 0
            ? 'No entries yet — be the first to stamp innovation 🚀'
            : 'No entries match the current filters.'}
        </div>
      )}
    </div>
  );
}
