// Bundle analyzer (enabled with ANALYZE=true)
import analyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? analyzer({ enabled: true })
  : (cfg) => cfg;

// Determine environment + chosen auth origin (optional)
const isProd = process.env.NODE_ENV === 'production';
// If you want an explicit separate auth host in prod, set NEXT_PUBLIC_AUTH_ORIGIN to that full origin.
// Leave it undefined/empty in development to keep everything relative.
const AUTH_ORIGIN = (process.env.NEXT_PUBLIC_AUTH_ORIGIN || '').replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const baseConfig = {
  images: { unoptimized: true },
  // Optional directory-style URLs
  // trailingSlash: true,
  experimental: {},
  // Removed auth redirect: client code now always calls relative /api/auth.* endpoints; optional
  // cross-origin deployments should configure reverse proxy / CDN routing instead of Next redirects.

  // Note: For static export build (legacy), use npm run build:static which sets STATIC_EXPORT env separately.

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
