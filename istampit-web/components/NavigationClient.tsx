"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useRemoteSession } from '../lib/remoteSession';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import AuthBadge from './AuthBadge';

interface NavigationClientProps { logo?: React.ReactNode }

function MobileMenu({ isOpen, onClose, logo, session, signIn, signOut, status }: { isOpen: boolean; onClose: () => void; logo?: React.ReactNode; session: any; signIn: (path?: string)=>void; signOut: ()=>void; status: string }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Enhanced backdrop with stronger blur and contrast */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl ring-2 ring-gray-400 dark:ring-gray-500 border-l-4 border-primary-500 dark:border-primary-400 transform transition-transform duration-300 ease-out">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b-2 border-gray-200/80 dark:border-gray-700/80 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
            {logo ? <Link href="/" className="flex items-center transition-opacity hover:opacity-75" onClick={onClose}>{logo}</Link> : null}
            <button
              onClick={onClose}
              className="p-3 rounded-xl text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 hover:border-gray-400/70 dark:hover:border-gray-500/70"
              aria-label="Close mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 px-6 py-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm" aria-label="Mobile">
            <div className="space-y-2">
              {['/','/verify','/ledger','/embed','/docs'].map((href,i)=>{
                const labels = ['Home','Verify','Innovation Ledger','Embed','Documentation'];
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className="block px-4 py-3.5 rounded-xl text-gray-900 dark:text-gray-50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-800 dark:hover:text-primary-200 transition-all duration-200 font-medium text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 border border-transparent hover:border-primary-300 dark:hover:border-primary-700 backdrop-blur-sm hover:backdrop-blur-md"
                  >
                    {labels[i]}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="p-6 border-t-2 border-gray-200/80 dark:border-gray-700/80 space-y-4 bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-lg">
            {session ? (
              <>
                <div className="flex items-center space-x-4 p-3 rounded-xl bg-white/90 dark:bg-gray-700/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-soft">
                    {(session.user?.name || session.user?.email || '?').slice(0,1).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900 dark:text-gray-50 truncate max-w-[140px]">{session.user?.name || 'Unnamed'}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[140px]">{session.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={()=>{ signOut(); onClose(); }}
                  className="btn-ghost w-full justify-center text-base py-3 rounded-xl border-2 border-gray-400 dark:border-gray-500 hover:border-gray-500 dark:hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-600/90 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <button
                  disabled={status==='loading'}
                  onClick={()=>{ if(status!=='loading') { signIn('/'); onClose(); } }}
                  className="btn-ghost w-full justify-center text-base py-3 rounded-xl border-2 border-gray-400 dark:border-gray-500 hover:border-gray-500 dark:hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-600/90 font-medium"
                >
                  Sign In
                </button>
                <button
                  disabled={status==='loading'}
                  onClick={()=>{ if(status!=='loading') { signIn('/verify'); onClose(); } }}
                  className="btn-primary w-full justify-center text-base py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 backdrop-blur-sm font-semibold"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NavigationClient({ logo }: NavigationClientProps) {
  const PAGES_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';
  const [open, setOpen] = useState(false);
  const { session, status, signIn: legacySignIn, signOut } = useRemoteSession();
  // Wrap signIn to use NextAuth v4 pages API route with correct callbackUrl param
  function signIn(path?: string) {
  if (PAGES_STATIC) return; // disabled on static pages build
  if (status === 'loading') return;
  nextAuthSignIn('google', { callbackUrl: path || '/' });
  }
  return (
    <>
      <div className="hidden lg:flex items-center space-x-4">
        <ThemeToggle variant="dropdown" />
  <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-2"></div>
        {!PAGES_STATIC ? <AuthBadge /> : (
          <span className="text-xs text-gray-500" aria-label="Authentication disabled in static build">
            Auth disabled ·{' '}
            <a
              href={"https://app.istampit.io/api/auth/signin?callbackUrl=" + encodeURIComponent("https://istampit.io/verify")}
              className="underline hover:no-underline"
              rel="noopener noreferrer"
            >Sign in on live site</a>
          </span>
        )}
      </div>
      <div className="flex lg:hidden items-center space-x-3">
        <ThemeToggle />
        <button
          onClick={()=>setOpen(true)}
          className="p-3 rounded-xl text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          aria-label="Open mobile menu"
          aria-expanded={open}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
  <MobileMenu isOpen={open} onClose={()=>setOpen(false)} logo={logo} session={status==='authenticated'?session:null} signIn={signIn} signOut={signOut} status={status} />
    </>
  );
}
