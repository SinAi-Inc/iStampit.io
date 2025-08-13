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
});
