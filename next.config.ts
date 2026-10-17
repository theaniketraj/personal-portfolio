import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async redirects() {
        await Promise.resolve();
        return [
            {
                source: '/projects/tags/ci/cd',
                destination: '/projects/tags/ci-cd',
                permanent: true
            },
            {
                source: '/blog/tags/ci/cd',
                destination: '/blog/tags/ci-cd',
                permanent: true
            }
        ];
    }
};

export default nextConfig;
