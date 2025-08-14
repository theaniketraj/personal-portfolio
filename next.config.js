/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        stackbitPreview: process.env.STACKBIT_PREVIEW
    },
    trailingSlash: true,
    reactStrictMode: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Remove the fs configuration as it's no longer needed/supported
        // config.node is handled automatically by Next.js/webpack
        return config;
    },
    experimental: {
        largePageDataBytes: 1024 * 1024 // 1 MB
    }
};

module.exports = nextConfig;
