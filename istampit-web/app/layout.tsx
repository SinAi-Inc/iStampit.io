import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white px-6 py-4 mb-6 shadow-sm">
          <h1 className="text-xl font-semibold">iStampit — OpenTimestamps Verifier (Prototype)</h1>
        </header>
        <main className="container mx-auto px-6 pb-12 max-w-4xl">{children}</main>
        <footer className="text-center text-xs text-slate-500 py-8">MIT Licensed — Uses opentimestamps (LGPL)</footer>
      </body>
    </html>
  );
}
