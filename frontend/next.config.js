/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/experience', destination: '/about', permanent: true },
      { source: '/skills', destination: '/about', permanent: true },
    ]
  },
}

const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')()
  : (config) => config

module.exports = withBundleAnalyzer(nextConfig)
