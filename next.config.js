/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        stackbitPreview: process.env.STACKBIT_PREVIEW
    },
    trailingSlash: true,
    reactStrictMode: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Limit parallel processing to reduce memory usage
        config.parallelism = 1;

        // Reduce memory usage during build
        config.optimization = {
            ...config.optimization,
            concatenateModules: false
        };

        return config;
    },
    experimental: {
        largePageDataBytes: 250 * 1024 * 1024, // Increase to 250 MB to handle the massive content payload
        // Optimize memory usage
        workerThreads: false,
        cpus: 1
    }
};

module.exports = nextConfig;
