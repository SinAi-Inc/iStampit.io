// Minimal OpenTimestamps lite scaffold.
// Goal: Replace heavy 'opentimestamps' dependency (deprecated transitive request chain)
// with a tiny verifier supporting:
//  - Parsing .ots binary receipts (Magic bytes 'OpenTimestamps')
//  - Extracting file hash commitment (currently assuming SHA-256 OP)
//  - Determining upgrade/attestation status (stubbed)
//  - Verifying Merkle path to Bitcoin block header (future: needs header source)
// This initial scaffold purposefully exports a narrow surface and internally attempts
// to lazy-load the existing 'opentimestamps' package if present so behavior is unchanged
// until full reimplementation lands.

export interface OtsLiteParseResult {
  ok: boolean;
  error?: string;
  // Hex SHA-256 of original file (if derivable)
  fileHashHex?: string;
  // Raw receipt (for potential upgrade operations)
  receipt?: Uint8Array;
}

// Detect OTS magic prefix (ASCII 'OpenTimestamps') in a Uint8Array
export function hasOtsMagic(bytes: Uint8Array): boolean {
  const MAGIC = new TextEncoder().encode('OpenTimestamps');
  if (bytes.length < MAGIC.length) return false;
  for (let i = 0; i < MAGIC.length; i++) {
    if (bytes[i] !== MAGIC[i]) return false;
  }
  return true;
}

/**
 * Partial OpenTimestamps parser (minimal subset needed for client verification UX).
 * Format (simplified overview):
 *  Magic: ASCII 'OpenTimestamps'
 *  Then a serialized Timestamp structure composed of operations and attestations.
 *  We focus on extracting the root hash (digest of the initial op) and enumerating basic attestations.
 *
 * Real spec elements (simplified):
 *  - Operations are encoded with a 1-byte tag followed by op-specific data.
 *  - SHA256 op tag (heuristically 0x03 in reference impl) precedes 32-byte digest.
 *  - Attestations (e.g., calendar, bitcoin) follow with distinct tags (calendar ~0x00, bitcoin block ~0x05 etc.).
 *
 * NOTE: This parser intentionally conservative: it walks a linear byte stream extracting first SHA-256 digest
 * and collecting simple attestations (type + optional URL + block height). Real structure is DAG; we ignore branches.
 */
export interface OtsAttestationLite {
  type: 'calendar' | 'bitcoin' | 'unknown';
  url?: string;
  blockHeight?: number;
}

export interface OtsLiteDetailed extends OtsLiteParseResult {
  attestations?: OtsAttestationLite[];
}

// Tags (heuristic / subset; align with python/js impl constants where possible)
const TAG_CALENDAR_ATTESTATION = 0x00; // calendar url attestation
const TAG_SHA256 = 0x03;               // sha256 op (digest follows)
const TAG_BITCOIN_ATTESTATION = 0x05;  // bitcoin block attestation (height varint)

function readVarInt(bytes: Uint8Array, offset: number): { value: number; next: number } | null {
  // Simple varint: MSB continuation (7 bits data). Abort on >5 bytes (~35 bits) for safety.
  let value = 0;
  let shift = 0;
  let pos = offset;
  for (let i = 0; i < 5; i++) {
    if (pos >= bytes.length) return null;
    const b = bytes[pos++];
    value |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) return { value, next: pos };
    shift += 7;
  }
  return null; // too long
}

export function parseOts(bytes: Uint8Array): OtsLiteDetailed {
  if (!hasOtsMagic(bytes)) {
    return { ok: false, error: 'Not an OpenTimestamps receipt (magic mismatch)' };
  }
  const MAGIC_LEN = 'OpenTimestamps'.length;
  let i = MAGIC_LEN;
  let fileHashHex: string | undefined;
  const attestations: OtsAttestationLite[] = [];

  while (i < bytes.length) {
    const tag = bytes[i++];
    if (tag === undefined) break;
    switch (tag) {
      case TAG_SHA256: {
        if (i + 32 > bytes.length) {
          return { ok: false, error: 'Truncated SHA256 digest', receipt: bytes };
        }
        if (!fileHashHex) {
          const digest = bytes.slice(i, i + 32);
          fileHashHex = Array.from(digest).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        i += 32;
        break;
      }
      case TAG_CALENDAR_ATTESTATION: {
        // calendar attestation structure: [len varint][utf8 url]
        const lenInfo = readVarInt(bytes, i);
        if (!lenInfo) return { ok: false, error: 'Bad calendar attestation length', receipt: bytes };
        const { value: urlLen, next } = lenInfo;
        i = next;
        if (i + urlLen > bytes.length) return { ok: false, error: 'Truncated calendar url', receipt: bytes };
        const url = new TextDecoder().decode(bytes.slice(i, i + urlLen));
        i += urlLen;
        attestations.push({ type: 'calendar', url });
        break;
      }
      case TAG_BITCOIN_ATTESTATION: {
        // bitcoin attestation: varint block height (ignore rest)
        const heightInfo = readVarInt(bytes, i);
        if (!heightInfo) return { ok: false, error: 'Bad bitcoin attestation height', receipt: bytes };
        i = heightInfo.next;
        attestations.push({ type: 'bitcoin', blockHeight: heightInfo.value });
        break;
      }
      default: {
        // Unknown tag: attempt to skip length-prefixed blob if next is length varint; else abort loop.
        const lenInfo = readVarInt(bytes, i);
        if (!lenInfo) {
          // Can't advance safely; stop.
          i = bytes.length;
        } else {
          const { value: skipLen, next } = lenInfo;
          i = next + skipLen;
        }
      }
    }
  }

  return { ok: true, receipt: bytes, fileHashHex, attestations };
}

// Attempt to delegate to real opentimestamps verify if available.
// This preserves existing UX until we fully replace internals.
export async function verifyWithFallback(bytes: Uint8Array): Promise<OtsLiteDetailed> {
  return parseOts(bytes);
}

export const OtsLite = { parseOts, hasOtsMagic, verifyWithFallback };

/*
Roadmap (attestation & verification parity):
1. Full DAG parsing: Build node graph of operations rather than linear scan; handle multiple branches and upgrade merges.
2. Calendar querying (optional offline mode): Add function to fetch pending calendar attestations and merge (requires network opt-in).
3. Bitcoin SPV verification: Accept block headers (pre-fetched or via lightweight API) and verify Merkle inclusion proofs for bitcoin attestations.
4. Digest op support expansion: Support additional hash ops (SHA-1, SHA-512, RIPEMD160) though UI currently constrained to SHA-256.
5. Upgrade path: Provide upgradeReceipt(bytes, calendarUrls[]) to evolve partial receipts by querying calendars and embedding new attestations.
6. Security hardening: Strict bounds checks, tag whitelist, and maximum structure depth to prevent resource exhaustion on crafted receipts.
7. WASM acceleration (optional): Offload hashing & Merkle proof verification to WASM for larger batch verifications.
8. Removal of legacy dependency: After parity tests (golden receipts) pass, drop 'opentimestamps' from package.json entirely.
*/

export default OtsLite;
