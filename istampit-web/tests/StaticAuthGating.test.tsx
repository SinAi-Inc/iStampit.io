import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NavigationClient from '../components/NavigationClient';
import { ThemeProvider } from '../components/ThemeProvider';

// Helper to temporarily set env var
function withEnv(key: string, value: string | undefined, fn: () => void) {
  const prev = process.env[key];
  if (value === undefined) delete process.env[key]; else process.env[key] = value;
  try { fn(); } finally { if (prev === undefined) delete process.env[key]; else process.env[key] = prev; }
}

// Provide minimal window.fetch mock to suppress unhandled rejections when components attempt network calls
if (!(global as any).fetch) {
  (global as any).fetch = () => Promise.resolve({ ok: false, status: 404, json: async () => ({}) });
}
// Minimal window stub for components referencing layout metrics in error paths
if (!(global as any).window) {
  (global as any).window = { location: { reload: () => {} }, screenX:0, outerWidth:1024, screenY:0, outerHeight:768 } as any;
}

describe('Static auth gating', () => {
  it('hides full auth badge and shows fallback text when NEXT_PUBLIC_PAGES_STATIC=1', async () => {
    await withEnvAsync('NEXT_PUBLIC_PAGES_STATIC', '1', async () => {
      render(<ThemeProvider><NavigationClient /></ThemeProvider>);
      const fallback = await screen.findByText(/Auth disabled/i);
      expect(fallback).toBeTruthy();
      await waitFor(()=>{
        expect(screen.queryByText(/Sign out/i)).toBeNull();
      });
      const link = screen.getByText(/Sign in on live site/i) as HTMLAnchorElement;
      expect(link.href).toMatch(/\/api\/auth\/signin\?callbackUrl=/);
    });
  });

  it('does not show fallback text when static flag absent', async () => {
    await withEnvAsync('NEXT_PUBLIC_PAGES_STATIC', undefined, async () => {
      render(<ThemeProvider><NavigationClient /></ThemeProvider>);
      // Give effects a tick
      await waitFor(()=>{
        expect(screen.queryByText(/Auth disabled/i)).toBeNull();
      });
    });
  });

// Async wrapper helper mirroring withEnv but supporting async body
async function withEnvAsync(key: string, value: string | undefined, fn: () => Promise<void> | void) {
  const prev = process.env[key];
  if (value === undefined) delete process.env[key]; else process.env[key] = value;
  try { await fn(); } finally { if (prev === undefined) delete process.env[key]; else process.env[key] = prev; }
}
});
