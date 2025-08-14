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

describe('Static auth gating', () => {
  it('hides full auth badge and shows fallback text when NEXT_PUBLIC_PAGES_STATIC=1', () => {
    withEnv('NEXT_PUBLIC_PAGES_STATIC', '1', () => {
      render(<ThemeProvider><NavigationClient /></ThemeProvider>);
      expect(screen.getByText(/Auth disabled/i)).toBeTruthy();
      expect(screen.queryByText(/Sign out/i)).toBeNull();
    });
  });

  it('does not show fallback text when static flag absent', () => {
    withEnv('NEXT_PUBLIC_PAGES_STATIC', undefined, () => {
      render(<ThemeProvider><NavigationClient /></ThemeProvider>);
      expect(screen.queryByText(/Auth disabled/i)).toBeNull();
    });
  });
});
