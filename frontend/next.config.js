/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    STELLAR_NETWORK: process.env.STELLAR_NETWORK || 'testnet',
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || '',
  },
}

module.exports = nextConfig
