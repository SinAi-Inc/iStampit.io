"use client";
import React, { useEffect } from 'react';

// Client-side forwarder so static export can succeed (no server redirect or searchParams access during prerender).
// Dynamic deployment: instantly redirect client to generic NextAuth sign-in endpoint (no provider slug) preserving optional callbackUrl.
// Static deployment: show notice + link to live auth service generic endpoint.
export default function GoogleAuthForwarder() {
  const IS_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';
  useEffect(() => {
    if (IS_STATIC) return;
    try {
      const AUTH_ORIGIN = (process.env.NEXT_PUBLIC_AUTH_ORIGIN || 'https://auth.istampit.io').replace(/\/$/, '');
      const APP_ORIGIN = (process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.istampit.io').replace(/\/$/, '');
      const url = new URL(window.location.href);
      const raw = url.searchParams.get('callbackUrl') || '/verify';
      const safe = raw.startsWith('/') ? raw : '/verify';
      const full = `${APP_ORIGIN}${safe}`;
      window.location.replace(`${AUTH_ORIGIN}/api/auth/signin?callbackUrl=${encodeURIComponent(full)}`);
    } catch {
      window.location.replace('https://auth.istampit.io/api/auth/signin?callbackUrl='+encodeURIComponent('https://app.istampit.io/verify'));
    }
  }, [IS_STATIC]);

  if (!IS_STATIC) {
    return <p className="p-8 text-center text-sm text-gray-500">Redirecting to sign-in…</p>;
  }
  const safe = '/verify';
  return (
    <div className="max-w-md mx-auto p-8 text-center space-y-4 text-sm">
      <h1 className="text-xl font-semibold">Authentication Disabled</h1>
      <p className="text-gray-600 dark:text-gray-400">
        This static demo build does not include live authentication. Visit the live site to sign in.
      </p>
      <p>
  <a href={`https://auth.istampit.io/api/auth/signin?callbackUrl=${encodeURIComponent('https://app.istampit.io'+safe)}`} className="text-blue-600 underline">
          Continue on live app
        </a>
      </p>
    </div>
  );
}
