// Optional bundle analyzer (only if installed and ANALYZE=true)
let withBundleAnalyzer = (cfg) => cfg;
try {
  if (process.env.ANALYZE === 'true') {
    // eslint-disable-next-line
    withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true });
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
  // Hybrid deployment: allow dynamic API routes (stamping) + static pages.
  // Remove forced static export so /api/stamp & middleware run in production.
  reactStrictMode: true,
  experimental: {},
  images: { domains: [], unoptimized: false },
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
    return config;
  },
};
const nextConfig = withBundleAnalyzer(baseConfig);
export default nextConfig;
