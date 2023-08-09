/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['s.gravatar.com'],
  },
  experimental:{
    appDir:true
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

module.exports = nextConfig
