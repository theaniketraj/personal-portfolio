/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        stackbitPreview: process.env.STACKBIT_PREVIEW
    },
    trailingSlash: true,
    reactStrictMode: true,
    // Optimize webpack for development and production
    webpack: (config, { dev, isServer }) => {
        // Only apply optimizations in development for Visual Editor
        if (dev && !isServer) {
            // Reduce memory usage in development
            config.optimization = {
                ...config.optimization,
                concatenateModules: false,
                // Split chunks more aggressively in development
                splitChunks: {
                    chunks: 'all',
                    minSize: 10000,
                    maxSize: 100000,
                    cacheGroups: {
                        default: {
                            minChunks: 1,
                            priority: -20,
                            reuseExistingChunk: true,
                            maxSize: 100000
                        }
                    }
                }
            };

            // Limit parallelism in development
            config.parallelism = 1;
        }

        return config;
    },
    experimental: {
        largePageDataBytes: 250 * 1024 * 1024, // 250 MB for large content
        // Optimize for development server
        ...(process.env.NODE_ENV === 'development'
            ? {
                  workerThreads: false,
                  cpus: 1
              }
            : {})
    }
};

module.exports = nextConfig;
