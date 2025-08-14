"use client";
import { useState, useEffect, useCallback, useRef } from 'react';

interface RemoteSessionResponseV4 {
  user: { id?: string; email?: string; name?: string } | null;
  expires?: string;
}

// Support optional remote auth host for static-exported site; leave blank for same-origin
const AUTH_BASE = (process.env.NEXT_PUBLIC_AUTH_ORIGIN || '').replace(/\/$/, '');
const originPrefix = AUTH_BASE || '';
const PAGES_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';

export function useRemoteSession() {
  const [status, setStatus] = useState<'loading'|'authenticated'|'unauthenticated'>(PAGES_STATIC ? 'unauthenticated' : 'loading');
  const [session, setSession] = useState<any>(null);
  const disabledRef = useRef(false);

  const fetchSession = useCallback(async () => {
    if (PAGES_STATIC) return; // skip network in static build
    try {
  const res = await fetch(`${originPrefix || ''}/api/auth/session`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (res.status === 404) {
        // Auth API not present (static export). Stop further polling.
        disabledRef.current = true;
        setSession(null);
        setStatus('unauthenticated');
        return;
      }
      if (!res.ok) throw new Error('bad status');
      const data: RemoteSessionResponseV4 = await res.json();
      if (data.user) {
        setSession({ user: data.user });
        setStatus('authenticated');
      } else {
        setSession(null);
        setStatus('unauthenticated');
      }
    } catch (e) {
      setSession(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => { if (!PAGES_STATIC && typeof window !== 'undefined') fetchSession(); }, [fetchSession]);
  // Lightweight polling every 90s (balance freshness vs cost)
  useEffect(() => {
  if (PAGES_STATIC || typeof window === 'undefined') return;
    const t = setInterval(() => { if (!disabledRef.current) fetchSession(); }, 90000);
    return () => clearInterval(t);
  }, [fetchSession]);

  const signIn = useCallback((callbackPath: string = '/') => {
  if (PAGES_STATIC || typeof window === 'undefined') return; // disabled or non-browser
    const w = 520, h = 640;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2.2;
    const callbackUrl = encodeURIComponent(callbackPath);
  window.open(`${originPrefix || ''}/api/auth/signin/google?callbackUrl=${callbackUrl}`, 'istampit-auth', `popup=yes,width=${w},height=${h},left=${left},top=${top},resizable,scrollbars`);
  }, []);

  const signOut = useCallback(() => {
  if (PAGES_STATIC || typeof window === 'undefined') return; // disabled or non-browser
    fetch(`${originPrefix || ''}/api/auth/csrf`, { credentials: 'include', headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(csrf => fetch(`${originPrefix || ''}/api/auth/signout`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ csrfToken: csrf.csrfToken }).toString()
      }))
      .finally(()=> setTimeout(()=>window.location.reload(), 300));
  }, []);

  return { status, session, signIn, signOut, refresh: fetchSession };
}
