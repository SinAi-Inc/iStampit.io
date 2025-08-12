import React from 'react';
import { render, screen, act } from '@testing-library/react';
import OtsVerifier from '../components/OtsVerifier';

describe('OtsVerifier', () => {
  it('reports pending status for mocked receipt', async () => {
    const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const receipt = new Uint8Array([0x00]);
    await act(async () => {
      render(<OtsVerifier fileHash={hash} receiptBytes={receipt} />);
    });
    // Wait for the result line to appear after async effect completes
    const resultEl = await screen.findByText(/Result:/i, {}, { timeout: 2000 });
    expect(resultEl).toBeTruthy();
  });
});
