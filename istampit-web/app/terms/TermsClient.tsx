"use client";
import React from 'react';

export default function TermsClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Terms of Service</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Terms and conditions for using iStampit.io</p>
        <div className="text-sm text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 inline-block">
          Last Updated: August 14, 2025
        </div>
      </div>

      {/* Introduction */}
      <section className="space-y-6">
        <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl border border-primary-200 dark:border-primary-800">
          <p className="text-gray-700 dark:text-gray-300">
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of iStampit.io and its related services. By using our Services, you agree to these Terms.
          </p>
        </div>
      </section>

      {/* Acceptance of Terms */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          1. Acceptance of Terms
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300">
            By creating an account or using our Services, you agree to comply with these Terms and our Privacy Policy. If you do not agree, do not use our Services.
          </p>
        </div>
      </section>

      {/* Eligibility */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          2. Eligibility
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300">
            You must be at least 18 years old (or the legal age in your jurisdiction) to use our Services.
          </p>
        </div>
      </section>

      {/* Accounts */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          3. Accounts
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>You are responsible for keeping your account credentials secure.</li>
            <li>You must provide accurate and complete information.</li>
            <li>You are responsible for all activity under your account.</li>
          </ul>
        </div>
      </section>

      {/* Acceptable Use */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          4. Acceptable Use
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300 mb-4">You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Use the Services for unlawful purposes</li>
            <li>Reverse-engineer, decompile, or copy parts of the platform</li>
            <li>Upload malicious code or attempt to disrupt our systems</li>
            <li>Violate intellectual property rights</li>
          </ul>
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-800 dark:text-red-200 text-sm">
              <strong>Important:</strong> Violations of these terms may result in immediate account suspension or termination.
            </p>
          </div>
        </div>
      </section>

      {/* Intellectual Property */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          5. Intellectual Property
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300">
            All content, trademarks, and software on iStampit.io are owned by us or our licensors. You may not reproduce, distribute, or create derivative works without permission.
          </p>
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Note:</strong> You retain ownership of any content you upload. We do not claim rights to your files or timestamps.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription & Payments */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          6. Subscription & Payments
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Some Services require a paid subscription.</li>
            <li>Fees are billed according to the plan you select.</li>
            <li>All payments are processed securely through third-party providers.</li>
            <li>No refunds are provided unless required by law.</li>
          </ul>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Free Tier</h4>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Basic verification features available at no cost
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Premium Features</h4>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Advanced tools and integrations with subscription
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Termination */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          7. Termination
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300">
            We may suspend or terminate your account if you violate these Terms or engage in fraudulent activity. You may stop using the Services at any time.
          </p>
        </div>
      </section>

      {/* Disclaimers & Limitation of Liability */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          8. Disclaimers & Limitation of Liability
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>The Services are provided &ldquo;as is&rdquo; without warranties of any kind.</li>
            <li>We are not liable for any indirect, incidental, or consequential damages.</li>
            <li>Our total liability will not exceed the amount you paid us in the last 12 months.</li>
          </ul>
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Blockchain Disclaimer:</strong> While we use Bitcoin blockchain for timestamps, we cannot guarantee the perpetual availability of blockchain data or third-party services.
            </p>
          </div>
        </div>
      </section>

      {/* Governing Law */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          9. Governing Law
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300">
            These Terms are governed by the laws of Delaware, USA, without regard to conflict of law principles.
          </p>
        </div>
      </section>

      {/* Changes to These Terms */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          10. Changes to These Terms
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300">
            We may update these Terms at any time. Continued use of the Services after changes are posted constitutes your acceptance.
          </p>
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Notification:</strong> We will notify users of significant changes via email or platform announcements.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          11. Contact
        </h2>
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-6 rounded-xl border border-primary-200 dark:border-primary-800">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            For questions about these Terms of Service, contact us at:
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📧</span>
            <a
              href="mailto:support@istampit.io"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-lg transition-colors"
            >
              support@istampit.io
            </a>
          </div>
        </div>
      </section>

      {/* Additional Legal Notice */}
      <section className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Legal Notice</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            iStampit.io is operated by SinAI Inc. This service uses the OpenTimestamps protocol and Bitcoin blockchain for timestamp verification.
            Users are responsible for understanding the technical and legal implications of blockchain-based timestamping in their jurisdiction.
          </p>
        </div>
      </section>
    </div>
  );
}
