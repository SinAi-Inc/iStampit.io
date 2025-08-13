import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VerifyClient from '../app/verify/VerifyClient';

vi.mock('../lib/remoteSession', () => ({
  useRemoteSession: () => ({ status: 'unauthenticated', session: null, signIn: vi.fn() })
}));

describe('VerifyClient auth gate', () => {
  it('prompts sign in when unauthenticated', () => {
    render(<VerifyClient />);
    expect(screen.getByText(/Sign In Required/i)).toBeTruthy();
    expect(screen.queryByText(/Verify OpenTimestamps Receipt/i)).toBeNull();
  });
});
