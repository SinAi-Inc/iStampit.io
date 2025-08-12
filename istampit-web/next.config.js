/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  output: 'export',
  basePath: isProd ? '/istampit-web' : '',
  images: { unoptimized: true },
  // Optional directory-style URLs
  // trailingSlash: true,
  experimental: {},
};
export default nextConfig;
