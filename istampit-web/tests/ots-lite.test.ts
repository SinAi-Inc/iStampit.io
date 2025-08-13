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

  it('extracts SHA256 digest with tag 0x03', () => {
    const magic = new TextEncoder().encode('OpenTimestamps');
    const tagSha256 = new Uint8Array([0x03]);
    const digest = new Uint8Array(32).fill(0xbb);
    const combined = new Uint8Array(magic.length + 1 + 32);
    combined.set(magic, 0);
    combined.set(tagSha256, magic.length);
    combined.set(digest, magic.length + 1);
    const res = parseOts(combined);
    expect(res.ok).toBe(true);
    expect(res.fileHashHex).toBe('bb'.repeat(32));
  });

  it('parses calendar attestation (tag 0x00 with varint len + url)', () => {
    const magic = new TextEncoder().encode('OpenTimestamps');
    const tagCalendar = new Uint8Array([0x00]);
    const url = 'https://calendar.example';
    const urlBytes = new TextEncoder().encode(url);
    // simple varint for length (fits in one byte)
    const len = new Uint8Array([urlBytes.length]);
    const tagSha256 = new Uint8Array([0x03]);
    const digest = new Uint8Array(32).fill(0xcd);
    // order: magic | sha256 tag | digest | calendar tag | len | url
    const combined = new Uint8Array(magic.length + 1 + 32 + 1 + 1 + urlBytes.length);
    let o = 0;
    combined.set(magic, o); o += magic.length;
    combined.set(tagSha256, o++);
    combined.set(digest, o); o += 32;
    combined.set(tagCalendar, o++);
    combined.set(len, o++);
    combined.set(urlBytes, o);
    const res = parseOts(combined);
    expect(res.ok).toBe(true);
    expect(res.attestations?.some(a => a.type === 'calendar' && a.url === url)).toBe(true);
  });

  it('parses bitcoin attestation (tag 0x05 with varint height)', () => {
    const magic = new TextEncoder().encode('OpenTimestamps');
    const tagSha256 = new Uint8Array([0x03]);
    const digest = new Uint8Array(32).fill(0xef);
    const tagBitcoin = new Uint8Array([0x05]);
    const height = 840000; // fits in 4 bytes varint (approx)
    // encode varint height
    function encodeVarInt(n: number) {
      const out: number[] = [];
      while (true) {
        const b = n & 0x7f;
        n >>= 7;
        if (n === 0) { out.push(b); break; }
        out.push(b | 0x80);
      }
      return Uint8Array.from(out);
    }
    const heightBytes = encodeVarInt(height);
    const combined = new Uint8Array(magic.length + 1 + 32 + 1 + heightBytes.length);
    let o = 0;
    combined.set(magic, o); o += magic.length;
    combined.set(tagSha256, o++);
    combined.set(digest, o); o += 32;
    combined.set(tagBitcoin, o++);
    combined.set(heightBytes, o);
    const res = parseOts(combined);
    expect(res.ok).toBe(true);
    expect(res.attestations?.some(a => a.type === 'bitcoin' && a.blockHeight === height)).toBe(true);
  });
});
