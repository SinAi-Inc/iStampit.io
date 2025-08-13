// Bundle analyzer (enabled with ANALYZE=true)
import analyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? analyzer({ enabled: true })
  : (cfg) => cfg;

/** @type {import('next').NextConfig} */
const baseConfig = {
  // Removed static export: dynamic auth routes & APIs required
  // Removed dynamic basePath to avoid export module resolution issues
  images: { unoptimized: true },
  // Optional directory-style URLs
  // trailingSlash: true,
  experimental: {},

  // Note: Security headers are configured at deployment level when using output: 'export'
  // For development, headers can be set via middleware instead

  webpack: (config) => {
    // Shim Node core modules used indirectly by opentimestamps -> request -> fs/net/tls
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
