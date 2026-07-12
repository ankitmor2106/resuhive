import type { NextConfig } from 'next'

const devDomains = [
  process.env.REPLIT_DEV_DOMAIN,
  ...(process.env.REPLIT_DOMAINS?.split(',') ?? []),
].filter(Boolean) as string[]

const nextConfig: NextConfig = {
  // Allow Replit's proxy to access the dev server
  ...(devDomains.length > 0 ? { allowedDevOrigins: devDomains } : {}),
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:3001/api/v1'}/:path*`, // Proxy to Backend
      },
    ]
  },
}

export default nextConfig
