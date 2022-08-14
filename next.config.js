/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["theunitedstates.io"],
  },
};

module.exports = nextConfig;
