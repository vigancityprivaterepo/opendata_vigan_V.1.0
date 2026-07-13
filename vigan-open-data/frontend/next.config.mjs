/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'ckan',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    const ckanUrl = process.env.NEXT_PUBLIC_CKAN_URL || 'http://localhost:5000'
    return [
      // Proxy CKAN API calls server-side to avoid CORS in dev
      {
        source: '/ckan-api/:path*',
        destination: `${ckanUrl}/api/:path*`,
      },
      // CKAN fanstatic / base JS+CSS bundles
      {
        source: '/fanstatic/:path*',
        destination: `${ckanUrl}/fanstatic/:path*`,
      },
      {
        source: '/base/:path*',
        destination: `${ckanUrl}/base/:path*`,
      },
      // CKAN built-in static image assets (e.g. /img/ajaxload-circle.gif)
      {
        source: '/img/:path*',
        destination: `${ckanUrl}/img/:path*`,
      },
      // CKAN extension public static files
      {
        source: '/images/:path*',
        destination: `${ckanUrl}/images/:path*`,
      },
      // CKAN webassets (used by some CKAN versions)
      {
        source: '/webassets/:path*',
        destination: `${ckanUrl}/webassets/:path*`,
      },
      // Uploaded files
      {
        source: '/uploads/:path*',
        destination: `${ckanUrl}/uploads/:path*`,
      },
      // CKAN activity tracking beacon
      {
        source: '/_tracking',
        destination: `${ckanUrl}/_tracking`,
      },
    ]
  },
  async headers() {
    return [
      {
        // Apply frame-options only to top-level Next.js pages, NOT to the CKAN proxy
        // responses that are loaded inside the iframe.
        source: '/((?!api/ckan-proxy).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
