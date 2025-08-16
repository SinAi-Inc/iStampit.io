import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LedgerClient from '../app/ledger/LedgerClient';

vi.mock('../lib/ledger', () => ({
  fetchLedger: vi.fn(async () => ({ entries: [], metadata: { lastUpdated: new Date().toISOString(), totalEntries: 0, confirmedEntries: 0, pendingEntries: 0 } }))
}));

describe('LedgerClient public', () => {
  it('renders empty state without auth prompts', async () => {
    render(<LedgerClient />);
    await waitFor(()=>{
      expect(screen.getByText(/No ledger data available/i)).toBeTruthy();
    });
    expect(screen.queryByText(/Sign in/i)).toBeNull();
  });
});
