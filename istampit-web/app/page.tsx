export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">
          Provable Innovation, <span className="text-blue-600">For Everyone</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Verifiable proof-of-existence for research & creative artifacts using OpenTimestamps on Bitcoin.
          Secure your intellectual property timeline without revealing sensitive content.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/verify"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Verify Timestamp
          </a>
          <a
            href="/ledger"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
          >
            Browse Ledger
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-lg font-semibold">Privacy First</h3>
          <p className="text-gray-600 text-sm">
            Only cryptographic hashes are published — never your original files or content.
            Zero intellectual property leakage.
          </p>
        </div>
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⛓️</span>
          </div>
          <h3 className="text-lg font-semibold">Bitcoin Secured</h3>
          <p className="text-gray-600 text-sm">
            Timestamps are anchored in Bitcoin&apos;s blockchain using OpenTimestamps —
            immutable and independently verifiable.
          </p>
        </div>
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🛠️</span>
          </div>
          <h3 className="text-lg font-semibold">Developer Ready</h3>
          <p className="text-gray-600 text-sm">
            CLI tools, GitHub Actions, and embeddable widgets.
            Integrate timestamping into your existing workflow.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-medium">1</div>
            <h3 className="font-medium mb-2">Hash Locally</h3>
            <p className="text-sm text-gray-600">
              Your document is hashed (SHA-256) on your device. The original never leaves your control.
            </p>
          </div>
          <div>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-medium">2</div>
            <h3 className="font-medium mb-2">Submit Hash</h3>
            <p className="text-sm text-gray-600">
              Only the hash is sent to OpenTimestamps calendars — no content, no metadata.
            </p>
          </div>
          <div>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-medium">3</div>
            <h3 className="font-medium mb-2">Bitcoin Proof</h3>
            <p className="text-sm text-gray-600">
              Calendars aggregate hashes into Bitcoin transactions, creating immutable proof.
            </p>
          </div>
          <div>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-medium">4</div>
            <h3 className="font-medium mb-2">Get Receipt</h3>
            <p className="text-sm text-gray-600">
              Download your .ots receipt — mathematically proves your document existed at that time.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Ready to Start?</h2>
        <p className="text-gray-600">
          Try our verification tool with a sample file, or explore our public Innovation Ledger.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/verify"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Verification
          </a>
          <a
            href="/ledger"
            className="text-blue-600 hover:text-blue-800"
          >
            View Public Ledger →
          </a>
        </div>
      </section>
    </div>
  );
}
