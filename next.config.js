/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        stackbitPreview: process.env.STACKBIT_PREVIEW
    },
    trailingSlash: true,
    reactStrictMode: true
};

module.exports = {
    future: {
    webpack5: true,
  },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Increase Node.js memory limit to 4GB
    config.node = {
      fs: 'empty',
      ...config.node,
    };

    return config;
  },
  experimental: {
    largePageDataBytes: 1024 * 1024, // for example, 1 MB
  }
}
