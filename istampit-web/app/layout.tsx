import './globals.css';
import type { ReactNode } from 'react';
import MonitoringDashboard from '../components/MonitoringDashboard';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white px-6 py-4 mb-6 shadow-sm embed-hide">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              <a href="/" className="hover:text-blue-600">iStampit</a>
            </h1>
            <nav className="flex gap-6">
              <a href="/verify" className="text-sm hover:text-blue-600">Verify</a>
              <a href="/ledger" className="text-sm hover:text-blue-600">Innovation Ledger</a>
              <a href="/embed" className="text-sm hover:text-blue-600">Embed</a>
              <a href="/docs" className="text-sm hover:text-blue-600">Docs</a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-6 pb-12">{children}</main>
        <footer className="text-center text-xs text-slate-500 py-8 embed-hide">
          <p>Provable innovation, for everyone. MIT Licensed — Uses opentimestamps (LGPL)</p>
        </footer>
        <MonitoringDashboard />
      </body>
    </html>
  );
}
