/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        stackbitPreview: process.env.STACKBIT_PREVIEW
    },
    trailingSlash: true,
    reactStrictMode: true,

    // Performance optimizations
    swcMinify: true,
    compress: true,
    poweredByHeader: false,

    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
    },

    // Headers for better caching
    async headers() {
        return [
            {
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            }
        ];
    },

    // Webpack optimizations
    webpack: (config, { dev, isServer }) => {
        // Production optimizations
        if (!dev) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    minSize: 20000,
                    maxSize: 244000,
                    cacheGroups: {
                        framework: {
                            chunks: 'all',
                            name: 'framework',
                            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
                            priority: 40,
                            enforce: true
                        },
                        lib: {
                            test: /[\\/]node_modules[\\/]/,
                            name: 'lib',
                            priority: 30,
                            chunks: 'all'
                        },
                        commons: {
                            name: 'commons',
                            minChunks: 2,
                            priority: 20,
                            chunks: 'all'
                        }
                    }
                }
            };
        }

        // Memory optimizations for all builds
        config.parallelism = 1;

        return config;
    },

    experimental: {
        largePageDataBytes: 128 * 1024, // Reduce to 128KB max per page
        // Development optimizations
        ...(process.env.NODE_ENV === 'development'
            ? {
                  workerThreads: false,
                  cpus: 1,
                  optimizeCss: false,
                  // Enable ISR in development for faster rebuilds
                  fallbackBlockingMode: 'blocking'
              }
            : {
                  // Production optimizations
                  modularizeImports: {
                      dayjs: {
                          transform: 'dayjs/{{member}}'
                      }
                  }
              })
    }
};

module.exports = nextConfig;
