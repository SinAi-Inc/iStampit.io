"use client";
import React from 'react';

export default function PrivacyClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Privacy Policy</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">How we collect, use, and protect your information</p>
        <div className="text-sm text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 inline-block">
          Last Updated: August 14, 2025
        </div>
      </div>

      {/* Introduction */}
      <section className="space-y-6">
        <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl border border-primary-200 dark:border-primary-800">
          <p className="text-gray-700 dark:text-gray-300">
            At iStampit.io, your privacy matters to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website, services, and products (collectively, the &ldquo;Services&rdquo;).
          </p>
        </div>
      </section>

      {/* Information We Collect */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          1. Information We Collect
        </h2>
        <div className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300">We collect two types of information:</p>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">a. Information You Provide Directly</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Account details (name, email address, password)</li>
                <li>Payment and billing information (processed via secure third-party providers)</li>
                <li>Any content you upload or generate using our Services</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">b. Information Collected Automatically</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Device information (browser type, operating system, IP address)</li>
                <li>Usage data (pages visited, features used, timestamps)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How We Use Your Information */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          2. How We Use Your Information
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300 mb-4">We use your information to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Provide, maintain, and improve our Services</li>
            <li>Process payments and send invoices</li>
            <li>Communicate with you (updates, security alerts, support responses)</li>
            <li>Prevent fraudulent activity and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>
      </section>

      {/* Sharing of Information */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          3. Sharing of Information
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-4 rounded">
            <p className="text-green-800 dark:text-green-200 font-medium">
              We do not sell your personal information.
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">We may share your data only with:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Service providers who help operate our platform (e.g., payment processors, analytics tools)</li>
            <li>Legal authorities when required to comply with laws or respond to lawful requests</li>
            <li>Business transfers in case of a merger, acquisition, or sale of assets</li>
          </ul>
        </div>
      </section>

      {/* Data Retention */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          4. Data Retention
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300">
            We keep your information for as long as needed to provide the Services or comply with legal obligations. You can request deletion at any time.
          </p>
        </div>
      </section>

      {/* Security */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          5. Security
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300">
            We implement industry-standard security measures to protect your information. However, no online service can guarantee 100% security.
          </p>
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Important:</strong> iStampit.io never stores your files or file contents. Only cryptographic hashes are processed for timestamp verification.
            </p>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          6. Your Rights
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300 mb-4">Depending on your location, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Access, update, or delete your personal information</li>
            <li>Object to certain processing activities</li>
            <li>Request data portability</li>
            <li>Withdraw consent (where applicable)</li>
          </ul>
          <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <p className="text-gray-700 dark:text-gray-300">
              To exercise your rights, contact us at{' '}
              <a href="mailto:support@istampit.io" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                support@istampit.io
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Third-Party Services */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          7. Third-Party Services
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300">
            Our Services may contain links to third-party websites. We are not responsible for their privacy practices.
          </p>
        </div>
      </section>

      {/* Changes to This Policy */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          8. Changes to This Policy
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <p className="text-gray-700 dark:text-gray-300">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date.
          </p>
        </div>
      </section>

      {/* Contact Us */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">
          9. Contact Us
        </h2>
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-6 rounded-xl border border-primary-200 dark:border-primary-800">
          <p className="text-gray-700 dark:text-gray-300 mb-4">If you have questions about this Privacy Policy, contact us at:</p>
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
    </div>
  );
}
