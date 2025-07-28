/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        stackbitPreview: process.env.STACKBIT_PREVIEW
    },
    trailingSlash: true,
    reactStrictMode: true
};

module.exports = {
  experimental: {
    largePageDataBytes: 1024 * 1024, // for example, 1 MB
  }
}
