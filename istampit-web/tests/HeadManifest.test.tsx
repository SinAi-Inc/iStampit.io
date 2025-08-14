import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
// Mock next/font/google for Vitest environment (Inter invocation isn't needed for manifest gating logic)
vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mock-inter' })
}));

function withEnv(key: string, value: string | undefined, fn: () => void) {
  const prev = process.env[key];
  if (value === undefined) delete process.env[key]; else process.env[key] = value;
  try { fn(); } finally { if (prev === undefined) delete process.env[key]; else process.env[key] = prev; }
}

describe('Head manifest gating', () => {
  it('omits manifest tag when NEXT_PUBLIC_PAGES_STATIC=1', async () => {
    await withEnv('NEXT_PUBLIC_PAGES_STATIC', '1', async () => {
      vi.resetModules();
      const { default: RootLayout } = await import('../app/layout');
      const { container } = render(<RootLayout><div /></RootLayout> as any);
      expect(container.querySelector('link[rel="manifest"]')).toBeNull();
    });
  });
  it('includes manifest tag when flag not set', async () => {
    await withEnv('NEXT_PUBLIC_PAGES_STATIC', undefined, async () => {
      vi.resetModules();
      const { default: RootLayout } = await import('../app/layout');
      const { container } = render(<RootLayout><div /></RootLayout> as any);
      expect(container.querySelector('link[rel="manifest"]')).not.toBeNull();
    });
  });
});
