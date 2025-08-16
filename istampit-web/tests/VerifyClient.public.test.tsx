import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VerifyClient from '../app/verify/VerifyClient';

describe('VerifyClient public mode', () => {
  it('shows verification UI without auth prompts', () => {
    render(<VerifyClient />);
    expect(screen.queryByText(/Sign In Required/i)).toBeNull();
    expect(screen.getByText(/Verify OpenTimestamps Receipt/i)).toBeTruthy();
  });
});
