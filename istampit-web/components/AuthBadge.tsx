"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

// Optional remote auth origin (disabled for static-exported site to avoid unreachable fetches)
const PAGES_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';
const AUTH_BASE = PAGES_STATIC ? '' : (process.env.NEXT_PUBLIC_AUTH_ORIGIN || '').replace(/\/$/, '');

type Session = { user?: { email?: string; name?: string; image?: string } };

export default function AuthBadge() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(false); // button busy state
  const disabledRef = useRef(false);
  const lastAuthCompleteRef = useRef<number>(0); // debounce duplicate messages
  const popupRef = useRef<Window | null>(null);

  const popupLogin = useCallback(() => {
    if (authLoading) return; // prevent double clicks
    // If no remote auth base, do a full redirect to local forwarder
    if (!AUTH_BASE) {
      setAuthLoading(true);
      window.location.href = '/api/auth/signin?callbackUrl=%2Fverify';
      return;
    }
    setAuthLoading(true);
    const w = 520, h = 640;
    const left = window.screenX + Math.max(0, (window.outerWidth - w) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - h) / 2.5);
    const cbAbs = encodeURIComponent(window.location.origin + '/verify');
    const url = `${AUTH_BASE}/api/auth/signin?callbackUrl=${cbAbs}`;
    const popup = window.open(url, 'istampit_auth', `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`);
    popupRef.current = popup;
    if (!popup) {
      // Popup blocked – fallback to same-tab redirect
      window.location.href = url;
      return;
    }
    let closedPoll: number | undefined;
    const cleanup = () => {
      window.removeEventListener('message', onMsg);
      if (closedPoll) window.clearInterval(closedPoll);
      popupRef.current = null;
      setAuthLoading(false);
    };
    const onMsg = (ev: MessageEvent) => {
      if (ev.source === popup && ev.data === 'auth:complete') {
        const now = Date.now();
        if (now - lastAuthCompleteRef.current < 1200) return; // debounce duplicates (Safari sometimes fires twice)
        lastAuthCompleteRef.current = now;
        cleanup();
        load();
      }
      if (ev.source === popup && ev.data === 'auth:close') {
        cleanup();
      }
    };
    window.addEventListener('message', onMsg);
    closedPoll = window.setInterval(() => { if (popup.closed) cleanup(); }, 600);
  }, [authLoading]);

  // Optional popup-based sign-out symmetry (remote auth only)
  const popupLogout = useCallback(() => {
    if (!AUTH_BASE) return; // local sign-out handled via next-auth button
    if (authLoading) return;
    setAuthLoading(true);
    const w = 480, h = 420;
    const left = window.screenX + Math.max(0, (window.outerWidth - w) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - h) / 2.5);
    const cbAbs = encodeURIComponent(window.location.origin + '/');
    // We cannot directly POST from here, open signout page which includes a form the user may auto-submit (NextAuth).
    // For improved UX we rely on NextAuth auto-submission; fallback timer closes.
    const url = `${AUTH_BASE}/api/auth/signout?callbackUrl=${cbAbs}`;
    const popup = window.open(url, 'istampit_signout', `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=no`);
    popupRef.current = popup;
    if (!popup) { window.location.href = url; return; }
    let closedPoll: number | undefined;
    const cleanup = () => {
      window.removeEventListener('message', onMsg);
      if (closedPoll) window.clearInterval(closedPoll);
      popupRef.current = null;
      setAuthLoading(false);
      setTimeout(()=>window.location.reload(), 400);
    };
    const onMsg = (ev: MessageEvent) => {
      if (ev.source === popup && (ev.data === 'auth:complete' || ev.data === 'signout:complete')) {
        cleanup();
      }
    };
    window.addEventListener('message', onMsg);
    closedPoll = window.setInterval(() => { if (popup.closed) cleanup(); }, 600);
    // Force cleanup after 8s if no event
    setTimeout(()=>{ if (popup && !popup.closed) { try { popup.close(); } catch {} } cleanup(); }, 8000);
  }, [authLoading]);

  async function load() {
    try {
      const url = AUTH_BASE ? `${AUTH_BASE}/api/auth/session` : '/api/auth/session';
      const res = await fetch(url, { credentials: 'include', headers: { Accept: 'application/json' } });
      if (res.status === 404) {
        disabledRef.current = true;
        setSession({});
        return;
      }
      if (!res.ok) { setSession({}); return; }
      setSession(await res.json());
    } catch { setSession({}); }
  }

  useEffect(() => {
    if (PAGES_STATIC || typeof window === 'undefined') return; // skip on static build or non-browser test env
    load();
    const id = setInterval(() => { if (!disabledRef.current) load(); }, 90_000);
    return () => clearInterval(id);
  }, []);
  if (PAGES_STATIC) return null; // fully hidden in static build
  if (!session) return <span className="text-xs text-gray-500">…</span>;

  if (!session.user) return (
    <button
      type="button"
      onClick={popupLogin}
      disabled={authLoading}
      className={`rounded px-3 py-2 border text-sm transition-colors ${authLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
      aria-busy={authLoading}
    >
      {authLoading ? 'Signing in…' : 'Sign in'}
    </button>
  );

  return (
    <div className="flex items-center gap-2 text-sm">
      {session.user?.image && (
        <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full" />
      )}
      <span className="max-w-[140px] truncate">{session.user?.email || session.user?.name || 'Signed in'}</span>
      {AUTH_BASE ? (
        <button
          className="rounded px-2 py-1 border text-xs hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          onClick={popupLogout}
          disabled={authLoading}
        >{authLoading ? '…' : 'Sign out'}</button>
      ) : (
        <button
          className="rounded px-2 py-1 border text-xs hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          onClick={() => nextAuthSignOut({ callbackUrl: '/' })}
          disabled={authLoading}
        >{authLoading ? '…' : 'Sign out'}</button>
      )}
    </div>
  );
}
