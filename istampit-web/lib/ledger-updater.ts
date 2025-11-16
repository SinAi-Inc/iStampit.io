/**
 * Ledger Updater Service
 *
 * Background service to check pending OpenTimestamps receipts and update their status
 * when Bitcoin confirmations arrive. This is a client-side or edge-function approach
 * that can be triggered periodically to keep the ledger up-to-date.
 */

import { LedgerEntry, LedgerData } from './ledger';

export interface UpdateResult {
  updated: number;
  checked: number;
  errors: string[];
}

/**
 * Check a single pending entry against OpenTimestamps calendars
 * to see if it has been confirmed on Bitcoin blockchain.
 */
async function checkPendingEntry(entry: LedgerEntry): Promise<LedgerEntry | null> {
  if (entry.status === 'confirmed') {
    return null; // Already confirmed, skip
  }

  try {
    // Fetch the .ots receipt file
    const receiptResponse = await fetch(entry.receiptUrl);
    if (!receiptResponse.ok) {
      console.warn(`Failed to fetch receipt for ${entry.id}`);
      return null;
    }

    const receiptBytes = new Uint8Array(await receiptResponse.arrayBuffer());

    // Use the OTS lite parser to check for Bitcoin attestations
    const { parseOts } = await import('./ots-lite');
    const parsed = parseOts(receiptBytes);

    if (!parsed.ok || !parsed.attestations) {
      return null;
    }

    // Look for Bitcoin attestation with block height
    const bitcoinAttestation = parsed.attestations.find(
      att => att.type === 'bitcoin' && att.blockHeight
    );

    if (bitcoinAttestation && bitcoinAttestation.blockHeight) {
      // Entry is now confirmed! Update with Bitcoin data
      // Note: We only have blockHeight from the attestation, txid and blockTime need blockchain lookup
      return {
        ...entry,
        status: 'confirmed',
        blockHeight: bitcoinAttestation.blockHeight,
        // Keep existing txid/blockTime if present, or leave as null for now
        // A full implementation would query blockchain API for these details
      };
    }
  } catch (error) {
    console.error(`Error checking entry ${entry.id}:`, error);
  }

  return null; // Still pending
}

/**
 * Update all pending entries in the ledger data.
 * Returns a new LedgerData object with updated entries.
 */
export async function updatePendingEntries(ledgerData: LedgerData): Promise<{
  updatedLedger: LedgerData;
  result: UpdateResult;
}> {
  const pendingEntries = ledgerData.entries.filter(e => e.status === 'pending');
  const result: UpdateResult = {
    updated: 0,
    checked: pendingEntries.length,
    errors: [],
  };

  const updatedEntries = [...ledgerData.entries];

  // Check each pending entry
  for (const entry of pendingEntries) {
    try {
      const updated = await checkPendingEntry(entry);
      if (updated) {
        // Replace the entry in the array
        const index = updatedEntries.findIndex(e => e.id === entry.id);
        if (index !== -1) {
          updatedEntries[index] = updated;
          result.updated++;
        }
      }
    } catch (error) {
      result.errors.push(`${entry.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Recompute metadata
  const confirmedCount = updatedEntries.filter(e => e.status === 'confirmed').length;
  const pendingCount = updatedEntries.filter(e => e.status === 'pending').length;

  const updatedLedger: LedgerData = {
    entries: updatedEntries,
    metadata: {
      ...ledgerData.metadata,
      lastUpdated: new Date().toISOString(),
      confirmedEntries: confirmedCount,
      pendingEntries: pendingCount,
    },
  };

  return { updatedLedger, result };
}

/**
 * Single entry update - useful for real-time checks
 */
export async function checkSingleEntry(entry: LedgerEntry): Promise<LedgerEntry> {
  const updated = await checkPendingEntry(entry);
  return updated || entry;
}
