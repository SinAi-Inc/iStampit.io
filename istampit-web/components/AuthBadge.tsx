"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

type Session = { authenticated: boolean; user?: { email?: string; name?: string; image?: string } };
// Prefer same-origin auth routes; allow optional override via NEXT_PUBLIC_AUTH_ORIGIN (e.g. separate auth domain in prod)
const AUTH_BASE = (process.env.NEXT_PUBLIC_AUTH_ORIGIN || '').replace(/\/$/, '');
const originPrefix = AUTH_BASE || '';

export default function AuthBadge() {
  const [session, setSession] = useState<Session | null>(null);

  async function load() {
    try {
  const res = await fetch(`${originPrefix}/api/session`, {
        credentials: 'include',
        headers: { Accept: 'application/json' }
      });
      if (res.status === 404) {
        setSession({ authenticated: false });
        return;
      }
      const data = (await res.json()) as Session;
      setSession(data);
    } catch {
      setSession({ authenticated: false });
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 90_000);
    return () => clearInterval(id);
  }, []);

  if (!session) return <span className="text-xs text-gray-500">…</span>;

  if (!session.authenticated) {
  const callbackTarget = '/dashboard';
    const callback = encodeURIComponent(callbackTarget);

    function openPopup() {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2.5;
  const url = `${originPrefix}/api/auth/signin/google?callbackUrl=${callback}`;
      const popup = window.open(
        url,
        'istampit_auth',
        `popup=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`
      );
      if (!popup) return;
      const listen = (ev: MessageEvent) => {
  // Accept messages only from same origin (or configured override)
  const allowedOrigin = AUTH_BASE ? new URL(AUTH_BASE).origin : window.location.origin;
  if (ev.origin !== allowedOrigin) return;
        if (ev.data === 'auth:complete') {
          window.removeEventListener('message', listen);
          popup.close();
          load();
        }
      };
      window.addEventListener('message', listen);
    }
    return (
      <button
        type="button"
        onClick={openPopup}
        className="rounded px-3 py-2 border text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
      >Sign in</button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {session.user?.image && (
        <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full" />
      )}
      <span className="max-w-[140px] truncate">{session.user?.email || session.user?.name || 'Signed in'}</span>
      <button
        className="rounded px-2 py-1 border text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={async () => {
          try {
            const csrf = await fetch(`${originPrefix}/api/auth/csrf`, {
              credentials: 'include', headers: { Accept: 'application/json' }
            }).then(r => r.json());
            await fetch(`${originPrefix}/api/auth/signout`, {
              method: 'POST', credentials: 'include',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({ csrfToken: csrf.csrfToken }).toString()
            });
          } finally {
            window.location.reload();
          }
        }}
      >Sign out</button>
    </div>
  );
}
