/** @type {import('next').NextConfig} */
module.exports = {
  target: 'serverless',
  reactStrictMode: true,
  distDir: 'build',
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};
