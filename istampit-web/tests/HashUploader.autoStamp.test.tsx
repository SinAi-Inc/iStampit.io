import { render } from '@testing-library/react';
// @ts-expect-error dynamic import fallback types
const fireEvent = (await import('@testing-library/react')).fireEvent as any;
// @ts-expect-error dynamic import fallback types
const screen = (await import('@testing-library/react')).screen as any;
// @ts-expect-error dynamic import fallback types
const waitFor = (await import('@testing-library/react')).waitFor as any;
import React from 'react';
import HashUploader from '../components/HashUploader';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch
const receiptBytes = new Uint8Array([1,2,3,4]);
const b64 = Buffer.from(receiptBytes).toString('base64');

beforeEach(()=>{
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ hash: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', filename: 'a.ots', size: receiptBytes.length, receiptB64: b64 })
  }) as any;
  // Mock URL.createObjectURL
  global.URL.createObjectURL = vi.fn().mockReturnValue('blob://test');
});

describe('HashUploader autoStamp', () => {
  it('auto stamps on valid hash paste', async () => {
    let gotHash: string | null = null;
    let receiptLen: number | null = null;
  render(<HashUploader onHash={(h)=>gotHash=h} autoStamp onReceipt={(b)=>receiptLen=b.length} />);
  const input = screen.getByPlaceholderText(/e3b0c442/i) as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' } });
  await waitFor(()=> expect(gotHash).toBeTruthy());
  await waitFor(()=> expect(fetch).toHaveBeenCalled());
  await waitFor(()=> expect(receiptLen).toBe(4));
  expect(screen.getByText(/Receipt ready/i)).toBeTruthy();
  });
});
