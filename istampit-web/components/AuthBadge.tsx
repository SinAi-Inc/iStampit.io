"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { signIn, signOut } from 'next-auth/react';

type Session = { user?: { email?: string; name?: string; image?: string } };

export default function AuthBadge() {
  const [session, setSession] = useState<Session | null>(null);

  async function load() {
    try {
      const res = await fetch('/api/auth/session', {
        credentials: 'include',
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) { setSession({}); return; }
      setSession(await res.json());
    } catch { setSession({}); }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 90_000);
    return () => clearInterval(id);
  }, []);

  if (!session) return <span className="text-xs text-gray-500">…</span>;

  if (!session.user) {
    return (
      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/verify' })}
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
        onClick={() => signOut({ callbackUrl: '/' })}
      >Sign out</button>
    </div>
  );
}
