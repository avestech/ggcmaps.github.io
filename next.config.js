/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  // AvesTech's repo is served at the domain root.
  basePath: '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
