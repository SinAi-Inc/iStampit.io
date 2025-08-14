import React from 'react';
import { render, screen } from '@testing-library/react';
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
  it('hides full auth badge and shows fallback text when NEXT_PUBLIC_PAGES_STATIC=1', () => {
    withEnv('NEXT_PUBLIC_PAGES_STATIC', '1', () => {
  render(<ThemeProvider><NavigationClient /></ThemeProvider>);
  const fallback = screen.getByText(/Auth disabled/i);
  expect(fallback).toBeTruthy();
      expect(screen.queryByText(/Sign out/i)).toBeNull();
  const link = screen.getByText(/Sign in on live site/i) as HTMLAnchorElement;
  expect(link.href).toMatch(/\/auth\/google\?callbackUrl=/);
    });
  });

  it('does not show fallback text when static flag absent', () => {
    withEnv('NEXT_PUBLIC_PAGES_STATIC', undefined, () => {
      render(<ThemeProvider><NavigationClient /></ThemeProvider>);
      expect(screen.queryByText(/Auth disabled/i)).toBeNull();
    });
  });
});
