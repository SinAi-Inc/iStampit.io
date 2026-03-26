import Link from 'next/link'
import NavigationClient from './NavigationClient'
import React from 'react'

interface NavigationProps {
  logo?: React.ReactNode
}

const IS_PAGES_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';

export default function Navigation({ logo }: NavigationProps = {}) {

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md embed-hide shadow-sm dark:shadow-gray-800/20">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            {logo ? (
              <Link href="/" className="flex items-center group transition-opacity hover:opacity-90">
                {logo}
              </Link>
            ) : (
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform duration-200 shadow-soft">
                  iS
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                  iStampit
                </span>
              </Link>
            )}

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" prefetch={!IS_PAGES_STATIC} className="nav-link focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg px-3 py-2">
                Home
              </Link>
              <Link href="/stamp" prefetch={!IS_PAGES_STATIC} className="nav-link focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg px-3 py-2">
                Create Timestamp
              </Link>
              <Link href="/verify" prefetch={!IS_PAGES_STATIC} className="nav-link focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg px-3 py-2">
                Verify
              </Link>
              <Link href="/ledger" prefetch={!IS_PAGES_STATIC} className="nav-link focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg px-3 py-2">
                Public Ledger
              </Link>
              <Link href="/embed" prefetch={!IS_PAGES_STATIC} className="nav-link focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg px-3 py-2">
                Embed
              </Link>
              <Link href="/docs" prefetch={!IS_PAGES_STATIC} className="nav-link focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg px-3 py-2">
                Documentation
              </Link>
            </div>

            {/* Actions + Mobile handled by client island */}
            <NavigationClient logo={logo} />
          </div>
        </nav>
      </header>
    </>
  )
}
