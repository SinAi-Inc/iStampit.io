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
          <thead className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 text-left">
            <tr>
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Title</th>
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">SHA-256</th>
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Status</th>
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Verification</th>
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Bitcoin</th>
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Tags</th>
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Stamped</th>
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{entry.title}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleCopyHash(entry.sha256)}
                    className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors inline-flex items-center gap-1 group"
                    title="Click to copy full hash"
                    aria-label="Copy SHA-256 hash"
                  >
                    {truncateHash(entry.sha256)}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" aria-hidden="true">📋</span>
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      entry.status === 'confirmed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700'
                    }`}>
                      <span className="text-base" role="img" aria-label={entry.status === 'confirmed' ? 'confirmed' : 'pending'}>
                        {entry.status === 'confirmed' ? '✓' : '⏳'}
                      </span>
                      {entry.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                    {entry.status === 'pending' && (
                      <span className="text-xs text-gray-500 dark:text-gray-400" title="Waiting for Bitcoin block confirmation">
                        (awaiting block)
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  {entry.verified ? (
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                        <span className="text-base">🔍</span>
                        Verified
                      </div>
                      {entry.verifiedAt && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(entry.verifiedAt).toLocaleDateString()}
                        </div>
                      )}
                      {entry.verificationCount && entry.verificationCount > 1 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {entry.verificationCount}× verified
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 dark:text-gray-500" title="Not yet verified by users">
                      <span className="opacity-60">-</span>
                    </div>
                  )}
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <span role="img" aria-hidden="true">⬇️</span>
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
            ? 'No entries yet - be the first to stamp innovation 🚀'
            : 'No entries match the current filters.'}
        </div>
      )}
    </div>
  );
}
