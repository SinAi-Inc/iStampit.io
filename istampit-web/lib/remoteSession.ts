"use client";
import { useState, useEffect, useCallback } from 'react';

interface RemoteSessionResponseV4 {
  user: { id?: string; email?: string; name?: string } | null;
  expires?: string;
}

// Always use same-origin relative calls; a distinct auth domain can be handled via reverse proxy.
const originPrefix = '';

export function useRemoteSession() {
  const [status, setStatus] = useState<'loading'|'authenticated'|'unauthenticated'>('loading');
  const [session, setSession] = useState<any>(null);

  const fetchSession = useCallback(async () => {
    try {
  const res = await fetch(`/api/auth/session`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (res.status === 404) {
        // Static-export / no runtime API: treat as logged out.
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

  useEffect(() => { fetchSession(); }, [fetchSession]);
  // Lightweight polling every 90s (balance freshness vs cost)
  useEffect(() => {
    const t = setInterval(fetchSession, 90000);
    return () => clearInterval(t);
  }, [fetchSession]);

  const signIn = useCallback((callbackPath: string = '/') => {
    const w = 520, h = 640;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2.2;
    const callbackUrl = encodeURIComponent(callbackPath);
  window.open(`/api/auth/signin/google?callbackUrl=${callbackUrl}`, 'istampit-auth', `popup=yes,width=${w},height=${h},left=${left},top=${top},resizable,scrollbars`);
  }, []);

  const signOut = useCallback(() => {
    fetch(`/api/auth/csrf`, { credentials: 'include', headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(csrf => fetch(`/api/auth/signout`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ csrfToken: csrf.csrfToken }).toString()
      }))
      .finally(()=> setTimeout(()=>window.location.reload(), 300));
  }, []);

  return { status, session, signIn, signOut, refresh: fetchSession };
}
