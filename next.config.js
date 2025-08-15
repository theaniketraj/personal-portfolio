/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        stackbitPreview: process.env.STACKBIT_PREVIEW
    },
    trailingSlash: true,
    reactStrictMode: true,
    experimental: {
        largePageDataBytes: 250 * 1024 * 1024 // 250 MB for large content
    }
};

module.exports = nextConfig;
