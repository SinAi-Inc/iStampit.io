import type { Metadata, Viewport } from "next";
import React from 'react';
import { Inter } from "next/font/google";
import Link from "next/link";
import './globals.css';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import MonitoringDashboard from '../components/MonitoringDashboard';
import { ThemeProvider } from '../components/ThemeProvider';
import Navigation from '../components/Navigation';
import { baseMetadata } from '../lib/seo/metadata';
import BrandLogo from '../components/BrandLogo';
import GoogleTag from '../components/GoogleTag';
import DemoBanner from '../components/DemoBanner';

const inter = Inter({ subsets: ["latin"], weight: ["400","600","700"] });
// Explicit static Pages flag for clarity & future regression safety
const IS_PAGES_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';

export const metadata: Metadata = {
  ...baseMetadata,
  title: "iStampit.io - Digital Watermarking & Timestamp Verification",
  description: "Secure your digital content with advanced watermarking technology. Bitcoin-secured timestamps, privacy-first proof of existence, and instant verification for creators and innovators.",
  keywords: [
    "digital watermarking",
    "timestamp verification",
    "blockchain proof",
    "bitcoin timestamps",
    "content protection",
    "copyright protection",
    "digital security",
    "opentimestamps",
    "proof of existence",
    "intellectual property protection",
    "SinAI Inc"
  ],
  authors: [{ name: "SinAI Inc", url: "https://istampit.io" }],
  creator: "SinAI Inc",
  publisher: "SinAI Inc",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" }
  ],
  colorScheme: 'light dark'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="iStampit.io" />
        <meta name="application-name" content="iStampit.io" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
  {/* PWA & iOS install assets */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/appicon_180.png" />
        {/* Include manifest only on dynamic (non-GitHub Pages static) builds */}
        {!IS_PAGES_STATIC && (
          <link rel="manifest" href="/site.webmanifest" />
        )}
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "iStampit.io",
              "description": "Digital watermarking and timestamp verification platform",
              "url": "https://istampit.io",
              "applicationCategory": "SecurityApplication",
              "operatingSystem": "Web Browser",
              "author": {
                "@type": "Organization",
                "name": "SinAI Inc",
                "url": "https://istampit.io"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
  <ThemeProvider defaultTheme="system" storageKey="istampit-theme">
          <Suspense fallback={null}>
            <GoogleTag />
          </Suspense>
          <div className="min-h-screen flex flex-col">
            {/* Demo banner for static export builds */}
            <DemoBanner />
            {/* Navigation */}
            <Navigation
              logo={
                <div className="flex items-center space-x-2 sm:space-x-3 group">
                  {/* Remove height-only CSS override to satisfy Next.js image aspect ratio warning.
                      If future responsive sizing needed, adjust both width & height (e.g. via a wrapper utility).
                   */}
                  <BrandLogo size={34} />
                  <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    iStampit.io
                  </span>
                </div>
              }
            />

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <footer
              className="embed-hide bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
              role="contentinfo"
              aria-label="Site footer"
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  {/* Company Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      iStampit.io
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Digital watermarking and timestamp verification platform. Secure your content with Bitcoin-anchored proof of existence.
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs">
                      Provable innovation, Free for everyone. MIT Licensed — Uses opentimestamps (LGPL)
                    </p>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                      Platform
                    </h4>
                    <nav aria-label="Footer navigation">
                      <ul className="space-y-2">
                        <li>
                          <Link
                            href="/stamp"
                            prefetch={process.env.NEXT_PUBLIC_PAGES_STATIC !== '1'}
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                          >
                            Create Timestamp
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/verify"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                          >
                            Verify Content
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/ledger"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                          >
                            Public Ledger
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>

                  {/* Legal & Support */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                      Support
                    </h4>
                    <nav aria-label="Legal navigation">
                      <ul className="space-y-2">
                        <li>
                          <Link
                            href="/privacy"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                          >
                            Privacy Policy
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/terms"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                          >
                            Terms of Service
                          </Link>
                        </li>
                        <li>
                          <a
                            href="https://github.com/SinAI-Inc/iStampit"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            GitHub
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-500 text-xs">
                      © {new Date().getFullYear()} iStampit.io. All rights reserved to{' '}
                      <a
                        href="https://sinai.eihdah.com"
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        SinAI Inc
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </footer>

            {/* Monitoring Dashboard - Only for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="fixed bottom-4 right-4 z-50">
                <MonitoringDashboard />
              </div>
            )}
          </div>
  </ThemeProvider>
      </body>
    </html>
  );
}
