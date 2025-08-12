import { describe, it, expect } from 'vitest';
import { sha256Hex } from '../lib/sha256';

describe('sha256Hex', () => {
  it('hashes empty input correctly', async () => {
    const hex = await sha256Hex(new Uint8Array());
    expect(hex).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
  it('hashes ascii text', async () => {
    const data = new TextEncoder().encode('OpenTimestamps');
    const hex = await sha256Hex(data);
    expect(hex.length).toBe(64);
  });
});
