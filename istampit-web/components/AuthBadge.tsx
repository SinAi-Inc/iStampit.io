"use client";
import { useEffect, useState } from 'react';

type Session = { authenticated: boolean; user?: { email?: string; name?: string; image?: string } };
const AUTH_ORIGIN = process.env.NEXT_PUBLIC_AUTH_ORIGIN || 'https://app.istampit.io';

export default function AuthBadge() {
  const [session, setSession] = useState<Session | null>(null);

  async function load() {
    try {
      const res = await fetch(`${AUTH_ORIGIN}/api/session`, {
        credentials: 'include',
        headers: { Accept: 'application/json' }
      });
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
    const callback = encodeURIComponent('https://app.istampit.io/dashboard');
    return (
      <a
        className="rounded px-3 py-2 border text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        href={`${AUTH_ORIGIN}/api/auth/signin?callbackUrl=${callback}`}
      >Sign in</a>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {session.user?.image && (
        <img src={session.user.image} alt="" width={28} height={28} className="rounded-full" />
      )}
      <span className="max-w-[140px] truncate">{session.user?.email || session.user?.name || 'Signed in'}</span>
      <button
        className="rounded px-2 py-1 border text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={async () => {
          try {
            const csrf = await fetch(`${AUTH_ORIGIN}/api/auth/csrf`, {
              credentials: 'include', headers: { Accept: 'application/json' }
            }).then(r => r.json());
            await fetch(`${AUTH_ORIGIN}/api/auth/signout`, {
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
