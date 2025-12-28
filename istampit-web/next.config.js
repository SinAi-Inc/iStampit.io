import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optional bundle analyzer (only if installed and ANALYZE=true)
let withBundleAnalyzer = (cfg) => cfg;
try {
  if (process.env.ANALYZE === 'true') {
    // eslint-disable-next-line
    const analyzer = await import('@next/bundle-analyzer');
    withBundleAnalyzer = analyzer.default({ enabled: true });
  }
} catch (_) {
  // analyzer not installed; ignore
}

// Determine environment + chosen auth origin (optional)
const isProd = process.env.NODE_ENV === 'production';
// If you want an explicit separate auth host in prod, set NEXT_PUBLIC_AUTH_ORIGIN to that full origin.
// Leave it undefined/empty in development to keep everything relative.
const AUTH_ORIGIN = (process.env.NEXT_PUBLIC_AUTH_ORIGIN || '').replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const baseConfig = {
  // Conditional static export for GitHub Pages
  output: process.env.STATIC_EXPORT === '1' ? 'export' : undefined,
  // Hybrid deployment: allow dynamic API routes (stamping) + static pages.
  // Remove forced static export so /api/stamp & middleware run in production.
  reactStrictMode: true,
  experimental: {
    // Reduce prefetch HEAD request errors in production static build
    optimizeCss: false,
  },
  images: { domains: [], unoptimized: process.env.STATIC_EXPORT === '1' },
  // Provide an explicit Turbopack config so Next.js 16+ doesn't error when it
  // detects the custom webpack() hook. We intentionally keep Turbopack using
  // its defaults for now; the webpack fallback below still applies when
  // building with webpack (Next.js <16 or when forcing webpack).
  turbopack: {
    // Point to monorepo root where node_modules with Next.js is installed
    root: path.resolve(__dirname, '..'),
  },
  // Legacy redirects still valid; keep but allow API auth path to fall through if needed.
  redirects: async () => [
    { source: '/auth/google', destination: '/verify', permanent: true },
    { source: '/session-test', destination: '/verify', permanent: true },
  ],
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    };

    // Exclude test files and API routes during static export
    if (process.env.STATIC_EXPORT === '1') {
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /\.(test|spec)\.(ts|tsx)$/,
        loader: 'ignore-loader'
      });
    }

    return config;
  },
};
const nextConfig = withBundleAnalyzer(baseConfig);
export default nextConfig;
