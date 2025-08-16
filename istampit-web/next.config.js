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
const isStaticExport = true; // always exporting static site now
const baseConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Optional directory-style URLs
  // trailingSlash: true,
  experimental: {},
  // Removed auth redirect: client code now always calls relative /api/auth.* endpoints; optional
  // cross-origin deployments should configure reverse proxy / CDN routing instead of Next redirects.

  // Note: For static export build (legacy), use npm run build:static which sets STATIC_EXPORT env separately.

  // Static HTML export always enabled
  webpack: (config) => {
    // Auth moved to dedicated service; no local Google OAuth env vars required.
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
