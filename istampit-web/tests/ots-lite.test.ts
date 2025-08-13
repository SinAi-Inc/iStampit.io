import { describe, it, expect } from 'vitest';
import { hasOtsMagic, parseOts } from '../lib/ots-lite';

describe('ots-lite', () => {
  it('detects magic prefix', () => {
    const bytes = new TextEncoder().encode('OpenTimestampsHello');
    expect(hasOtsMagic(bytes)).toBe(true);
  });

  it('rejects non-matching magic', () => {
    const bytes = new TextEncoder().encode('NotAReceipt');
    const res = parseOts(bytes);
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/magic/i);
  });

  it('parses minimal receipt', () => {
    const bytes = new TextEncoder().encode('OpenTimestamps');
    const res = parseOts(bytes);
    expect(res.ok).toBe(true);
    expect(res.receipt).toBeDefined();
  });

  it('extracts heuristic file hash when marker present', () => {
    // Construct bytes: magic + marker 0x0b + 32 bytes digest (all 0xaa)
    const magic = new TextEncoder().encode('OpenTimestamps');
    const marker = new Uint8Array([0x0b]);
    const digest = new Uint8Array(32).fill(0xaa);
    const combined = new Uint8Array(magic.length + 1 + 32);
    combined.set(magic, 0);
    combined.set(marker, magic.length);
    combined.set(digest, magic.length + 1);
    const res = parseOts(combined);
    expect(res.ok).toBe(true);
    expect(res.fileHashHex).toBe('aa'.repeat(32));
  });
});
