"use client";
import React from 'react';

// Displays a prominent banner when running in static demo mode (NEXT_PUBLIC_PAGES_STATIC=1)
export default function DemoBanner() {
  const IS_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';
  if (!IS_STATIC) return null;
  return (
    <div
      className="w-full bg-amber-500/95 text-white text-center text-sm py-2 px-3 font-medium tracking-wide shadow-lg z-[60] relative"
      role="note"
      aria-label="Static demo banner"
    >
      <span className="hidden sm:inline">You are viewing the static demo build. </span>
      Interactive authentication is disabled here. Continue to{' '}
      <a
        href="https://app.istampit.io/auth/google?callbackUrl=https%3A%2F%2Fistampit.io%2Fverify"
        className="underline font-semibold hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-amber-500 rounded"
        rel="noopener noreferrer"
      >live app sign‑in</a>.
    </div>
  );
}
