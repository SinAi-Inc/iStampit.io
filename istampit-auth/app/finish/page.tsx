"use client";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const ALLOWED_OPENERS = ['https://istampit.io'];

export default function FinishPage() {
  const params = useSearchParams();
  const callback = params.get('callback') || '/';
  useEffect(() => {
    const target = new URL(callback, window.location.origin);
    try {
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
  }, [callback]);
  return null;
}
