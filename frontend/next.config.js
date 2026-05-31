function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_BACKEND_URL',
  ]
  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`[ENV] Missing required environment variable: ${key}`)
    }
  }
  if (process.env.NEXT_PUBLIC_HERO_SHADER === undefined) {
    process.env.NEXT_PUBLIC_HERO_SHADER = 'true'
  }
}

validateEnv()

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

module.exports = withBundleAnalyzer({
  ...nextConfig,
  webpack(config) {
    config.module.rules.push({
      test: /\.glsl$/,
      type: 'asset/source',
    })
    return config
  },
})
