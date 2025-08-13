"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useRemoteSession } from '../lib/remoteSession';
import AuthBadge from './AuthBadge';

interface NavigationClientProps { logo?: React.ReactNode }

function MobileMenu({ isOpen, onClose, logo, session, signIn, signOut }: { isOpen: boolean; onClose: () => void; logo?: React.ReactNode; session: any; signIn: ()=>void; signOut: ()=>void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white dark:bg-gray-900 shadow-2xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            {logo ? <Link href="/" className="flex items-center" onClick={onClose}>{logo}</Link> : null}
            <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Close mobile menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav className="flex-1 px-6 py-6" aria-label="Mobile">
            <div className="space-y-1">
              {['/','/verify','/ledger','/embed','/docs'].map((href,i)=>{
                const labels = ['Home','Verify','Innovation Ledger','Embed','Documentation'];
                return (
                  <Link key={href} href={href} onClick={onClose} className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                    {labels[i]}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {session ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold">
                    {(session.user?.name || session.user?.email || '?').slice(0,1).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-800 dark:text-gray-100 truncate max-w-[140px]">{session.user?.name || 'Unnamed'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">{session.user?.email}</p>
                  </div>
                </div>
                   <button onClick={()=>{ signOut(); onClose(); }} className="btn-ghost w-full justify-center">Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={()=>{ signIn(); onClose(); }} className="btn-ghost w-full justify-center">Sign In</button>
                <button onClick={()=>{ signIn(); onClose(); }} className="btn-primary w-full justify-center">Get Started</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NavigationClient({ logo }: NavigationClientProps) {
  const [open, setOpen] = useState(false);
  const { session, status, signIn, signOut } = useRemoteSession();
  return (
    <>
      <div className="hidden lg:flex items-center space-x-4">
        <ThemeToggle variant="dropdown" />
        <AuthBadge />
      </div>
      <div className="flex lg:hidden items-center space-x-3">
        <ThemeToggle />
        <button onClick={()=>setOpen(true)} className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200" aria-label="Open mobile menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
  <MobileMenu isOpen={open} onClose={()=>setOpen(false)} logo={logo} session={status==='authenticated'?session:null} signIn={signIn} signOut={signOut} />
    </>
  );
}
