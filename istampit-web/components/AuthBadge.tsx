"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

// Optional remote auth origin (disabled for static-exported site to avoid unreachable fetches)
const PAGES_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';
const AUTH_BASE = PAGES_STATIC ? '' : (process.env.NEXT_PUBLIC_AUTH_ORIGIN || '').replace(/\/$/, '');

type Session = { user?: { email?: string; name?: string; image?: string } };

export default function AuthBadge() {
  const [session, setSession] = useState<Session | null>(null);
  const disabledRef = useRef(false);

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

  if (!session.user) {
    const handleSignIn = () => {
      if (AUTH_BASE) {
        const cb = encodeURIComponent(window.location.origin + '/verify');
        window.location.href = `${AUTH_BASE}/api/auth/signin?callbackUrl=${cb}`;
      } else {
        nextAuthSignIn('google', { callbackUrl: '/verify' });
      }
    };
    return <button type="button" onClick={handleSignIn} className="rounded px-3 py-2 border text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Sign in</button>;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {session.user?.image && (
        <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full" />
      )}
      <span className="max-w-[140px] truncate">{session.user?.email || session.user?.name || 'Signed in'}</span>
      {!AUTH_BASE && (
        <button
          className="rounded px-2 py-1 border text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => nextAuthSignOut({ callbackUrl: '/' })}
        >Sign out</button>
      )}
    </div>
  );
}
