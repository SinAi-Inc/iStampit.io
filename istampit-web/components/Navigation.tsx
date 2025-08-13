import Link from 'next/link'
import NavigationClient from './NavigationClient'
import React from 'react'

interface NavigationProps {
  logo?: React.ReactNode
}

export default function Navigation({ logo }: NavigationProps = {}) {

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md embed-hide">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            {logo ? (
              <Link href="/" className="flex items-center group">
                {logo}
              </Link>
            ) : (
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform duration-200">
                  iS
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  iStampit
                </span>
              </Link>
            )}

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/verify" className="nav-link">
                Verify
              </Link>
              <Link href="/ledger" className="nav-link">
                Innovation Ledger
              </Link>
              <Link href="/embed" className="nav-link">
                Embed
              </Link>
              <Link href="/docs" className="nav-link">
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
