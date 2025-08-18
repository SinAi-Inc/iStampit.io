import Link from 'next/link';

export default function HomeClient() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 py-20 lg:py-32"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,transparent,black,transparent)]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-medium">
                🚀 Provable Innovation Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Provable Innovation,{" "}
                <span className="gradient-text">Free for Everyone</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Verifiable proof-of-existence for research & creative artifacts using OpenTimestamps on Bitcoin Blockchain.
                Secure your intellectual property timeline without revealing sensitive content.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/stamp" className="btn-primary btn-lg">
                <span className="mr-2">🚀</span>
                Create Timestamp
              </Link>
              <Link href="/verify" className="btn-outline btn-lg">
                <span className="mr-2">🔍</span>
                Verify
              </Link>
              <Link href="/ledger" className="btn-outline btn-lg">
                <span className="mr-2">📋</span>
                Public Ledger
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-12">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Created to serve researchers, creators, and developers building new Innovations worldwide</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-sm font-medium">Blockchain Secured</div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="text-sm font-medium">MIT Licensed</div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="text-sm font-medium">Privacy First</div>
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* Features Section (deferred) */}
  <section className="py-20 bg-white dark:bg-gray-900 cv-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose iStampit?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Built on proven cryptographic principles with user privacy and security as core foundations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="feature-card group">
                <div className="feature-icon bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  🔒
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy First</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Only cryptographic hashes are published — never your original files or content.
                  Zero intellectual property leakage guaranteed.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">✓ Local processing</span>
                </div>
              </div>

              <div className="feature-card group">
                <div className="feature-icon bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                  ⛓️
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Blockchain Secured</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Timestamps are anchored in Bitcoin&apos;s blockchain using OpenTimestamps —
                  immutable and independently verifiable forever.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">✓ Immutable proof</span>
                </div>
              </div>

              <div className="feature-card group">
                <div className="feature-icon bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                  🛠️
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Developer Ready</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  CLI tools, GitHub Actions, and embeddable widgets.
                  Integrate timestamping into your existing workflow seamlessly.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">✓ API available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* How It Works Section (deferred) */}
  <section className="py-20 bg-gray-50 dark:bg-gray-800 cv-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Simple, secure, and transparent process in four steps
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto text-xl font-bold shadow-medium group-hover:scale-105 transition-transform duration-200">
                    1
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Hash Locally</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Your document is hashed (SHA-256) on your device. The original never leaves your control.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto text-xl font-bold shadow-medium group-hover:scale-105 transition-transform duration-200">
                    2
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">⚡</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Submit Hash</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Only the hash is sent to OpenTimestamps calendars — no content, no metadata.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto text-xl font-bold shadow-medium group-hover:scale-105 transition-transform duration-200">
                    3
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">₿</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Bitcoin Proof</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Calendars aggregate hashes into Bitcoin transactions, creating immutable proof.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto text-xl font-bold shadow-medium group-hover:scale-105 transition-transform duration-200">
                    4
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">📄</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Get Receipt</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Download your .ots receipt — mathematically proves your document existed at that time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* Stats Section (deferred) */}
  <section className="py-16 bg-primary-600 dark:bg-primary-800 cv-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">FREE</div>
                <div className="text-primary-100">Documents Timestamped</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-primary-100">Privacy Guaranteed</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-primary-100">Service Availability</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">MIT</div>
                <div className="text-primary-100">Open Source License</div>
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* Call to Action Section (deferred) */}
  <section className="py-20 bg-white dark:bg-gray-900 cv-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Ready to Start Timestamping?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Try our verification tool with a sample file, or explore our Public Ledger
                to see how others are using provable timestamps.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/verify" className="btn-primary btn-lg">
                <span className="mr-2">🚀</span>
                Start Verification Now
              </Link>
              <Link href="/ledger" className="btn-ghost">
                View Public Ledger →
              </Link>
            </div>

            {/* Help Card */}
            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl max-w-2xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400">💡</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Need Help Getting Started?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    Check out our documentation for detailed guides, API references, and integration examples.
                  </p>
                  <Link href="/docs" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
                    Read Documentation →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
