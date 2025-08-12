'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import ThemeToggle from './ThemeToggle'

interface NavigationProps {
  logo?: React.ReactNode
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  logo?: React.ReactNode
}

function MobileMenu({ isOpen, onClose, logo }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white dark:bg-gray-900 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            {logo ? (
              <Link href="/" className="flex items-center">
                {logo}
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  iS
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  iStampit
                </span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-6">
            <div className="space-y-1">
              <Link
                href="/"
                className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                onClick={onClose}
              >
                Home
              </Link>
              <Link
                href="/verify"
                className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                onClick={onClose}
              >
                Verify
              </Link>
              <Link
                href="/ledger"
                className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                onClick={onClose}
              >
                Innovation Ledger
              </Link>
              <Link
                href="/embed"
                className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                onClick={onClose}
              >
                Embed
              </Link>
              <Link
                href="/docs"
                className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                onClick={onClose}
              >
                Documentation
              </Link>
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <Link
              href="/login"
              className="btn-ghost w-full justify-center"
              onClick={onClose}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn-primary w-full justify-center"
              onClick={onClose}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Navigation({ logo }: NavigationProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeToggle variant="dropdown" />
              <div className="flex items-center space-x-3">
                <Link href="/login" className="btn-ghost">
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Open mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        logo={logo}
      />
    </>
  )
}
