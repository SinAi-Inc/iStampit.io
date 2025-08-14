"use client";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { useEffect } from 'react';

// Keep list of allowed opener origins (add staging domains as needed)
const ALLOWED_OPENERS = ['https://istampit.io'];

export default function FinishPage() {
  useEffect(() => {
    // Parse callback from query string client-side to avoid useSearchParams (which triggers prerender bailouts)
    let callback = '/';
    try {
      const qs = typeof window !== 'undefined' ? window.location.search : '';
      if (qs.startsWith('?')) {
        const params = new URLSearchParams(qs);
        callback = params.get('callback') || '/';
      }
    } catch { /* fallback to '/' */ }

    try {
      const target = new URL(callback, window.location.origin);
      if (window.opener && typeof window.opener.postMessage === 'function') {
        if (ALLOWED_OPENERS.includes(target.origin)) {
          window.opener.postMessage('auth:complete', target.origin);
        }
        setTimeout(() => window.close(), 80);
      } else {
        window.location.replace(callback);
      }
    } catch {
      window.location.replace(callback);
    }
  }, []);
  return null;
}
