"use client";
import { useState, useEffect, useCallback } from 'react';

interface RemoteSessionResponse {
  authenticated: boolean;
  user?: { id?: string; email?: string; name?: string };
}

const AUTH_ORIGIN = process.env.NEXT_PUBLIC_AUTH_ORIGIN || 'https://app.istampit.io';

export function useRemoteSession() {
  const [status, setStatus] = useState<'loading'|'authenticated'|'unauthenticated'>('loading');
  const [session, setSession] = useState<any>(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`${AUTH_ORIGIN}/api/session`, { credentials: 'include' });
      if (!res.ok) throw new Error('bad status');
      const data: RemoteSessionResponse = await res.json();
      if (data.authenticated) {
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

  const signIn = useCallback((callbackPath: string = '/') => {
    const callbackUrl = encodeURIComponent(window.location.origin + callbackPath);
    window.location.href = `${AUTH_ORIGIN}/api/auth/signin?callbackUrl=${callbackUrl}`;
  }, []);

  const signOut = useCallback(() => {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = `${AUTH_ORIGIN}/api/auth/signout`;
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
    setTimeout(()=>window.location.reload(), 1000);
  }, []);

  return { status, session, signIn, signOut, refresh: fetchSession };
}
