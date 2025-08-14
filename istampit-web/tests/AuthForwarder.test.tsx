import React from 'react';
// Global stubs early
// Minimal window stub pointing at local forwarder path (provider-agnostic now)
if (!(global as any).window) (global as any).window = { location: { href: 'http://localhost/auth/google' } };
if (!(global as any).document) (global as any).document = { createElement: () => ({ style: {} }), body: { appendChild: () => {} } } as any;
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Regression test ensuring /auth/google static notice & link presence (now generic auth service endpoint link).
vi.mock('next/navigation', () => ({}));

function withEnv(key: string, value: string | undefined, fn: () => void) {
  const prev = process.env[key];
  if (value === undefined) delete process.env[key]; else process.env[key] = value;
  try { fn(); } finally { if (prev === undefined) delete process.env[key]; else process.env[key] = prev; }
}

describe('Auth forwarder page', () => {
  it('renders static notice when NEXT_PUBLIC_PAGES_STATIC=1', () => {
    const prev = process.env.NEXT_PUBLIC_PAGES_STATIC;
    process.env.NEXT_PUBLIC_PAGES_STATIC = '1';
    (global as any).window = (global as any).window || { location: { href: 'http://localhost/auth/google' } };
    (global as any).document = (global as any).document || {
      createElement: () => ({ style: {} }),
      body: { appendChild: () => {} },
    };
    vi.resetModules();
    return import('../app/auth/google/page').then(mod => {
      const Page = mod.default as any;
      const { container } = render(<Page />);
      expect(screen.getByText(/Authentication Disabled/i)).toBeTruthy();
  const link = container.querySelector('a[href^="https://auth.istampit.io/api/auth/signin"]') as HTMLAnchorElement;
      expect(link).toBeTruthy();
      if (prev === undefined) delete process.env.NEXT_PUBLIC_PAGES_STATIC; else process.env.NEXT_PUBLIC_PAGES_STATIC = prev;
    });
  });
});
