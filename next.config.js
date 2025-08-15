/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        stackbitPreview: process.env.STACKBIT_PREVIEW
    },
    trailingSlash: true,
    reactStrictMode: true,
    // Optimize webpack for both development and production
    webpack: (config, { dev, isServer }) => {
        // Memory optimizations for all builds
        config.optimization = {
            ...config.optimization,
            concatenateModules: false,
        };
        
        // Limit parallelism to reduce memory usage
        config.parallelism = 1;
        
        // Only apply development-specific optimizations in dev mode
        if (dev && !isServer) {
            // Split chunks more aggressively in development
            config.optimization.splitChunks = {
                chunks: 'all',
                minSize: 5000, // Smaller minimum size
                maxSize: 50000, // Much smaller max size (50KB)
                cacheGroups: {
                    default: {
                        minChunks: 1,
                        priority: -20,
                        reuseExistingChunk: true,
                        maxSize: 50000
                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        priority: -10,
                        maxSize: 50000,
                        chunks: 'all'
                    }
                }
            };

            // Reduce resolve.modules to save memory
            config.resolve.modules = ['node_modules'];
        }

        return config;
    },
    experimental: {
        largePageDataBytes: 250 * 1024 * 1024, // 250 MB for large content
        // Optimize for development server
        ...(process.env.NODE_ENV === 'development'
            ? {
                  workerThreads: false,
                  cpus: 1,
                  // Disable some features in development to save memory
                  optimizeCss: false
              }
            : {})
    }
};

module.exports = nextConfig;
