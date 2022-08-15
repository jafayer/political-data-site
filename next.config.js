/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["theunitedstates.io"],
  },
  webpack: (config, { dev }) => {
    config.module.rules.push({
      test: /\.csv$/,
      exclude: /node_modules/,
      loader: "csv-loader",
      options: {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      },
    });
    return config;
  },
};

module.exports = nextConfig;
