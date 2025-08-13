/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		const csp = [
			"default-src 'self'",
			// OAuth endpoints / Google resources
			"connect-src 'self' https://accounts.google.com https://www.googleapis.com",
			"img-src 'self' data: https://lh3.googleusercontent.com https://*.googleusercontent.com",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
			"style-src 'self' 'unsafe-inline'",
			"frame-src https://accounts.google.com",
			"base-uri 'self'",
			"form-action 'self' https://accounts.google.com",
			"object-src 'none'",
			"frame-ancestors 'none'",
			'upgrade-insecure-requests'
		].join('; ');

		const perm = [
			'camera=()', 'microphone=()', 'geolocation=()', 'payment=()',
			'usb=()', 'accelerometer=()', 'gyroscope=()', 'magnetometer=()'
		].join(', ');

		return [
			{
				source: '/:path*',
				headers: [
					{ key: 'Content-Security-Policy', value: csp },
					{ key: 'Permissions-Policy', value: perm },
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'Referrer-Policy', value: 'no-referrer' },
					{ key: 'Strict-Transport-Security', value: 'max-age=15552000; includeSubDomains; preload' }
				]
			}
		];
	}
};
module.exports = nextConfig;
