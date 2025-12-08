import BaseLayout from '@/components/layouts/BaseLayout';
import { PageLayout } from '@/types';
import { allContent } from '@/utils/content';
import { createGlobalProps } from '@/utils/smart-props';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404({ global }) {
    // Construct a minimal page object that satisfies the BaseLayout requirements
    const page: PageLayout = {
        type: 'PageLayout',
        __metadata: { modelName: 'PageLayout', id: '404', urlPath: '/404' },
        title: 'Page Not Found',
        sections: []
    };

    return (
        <BaseLayout global={global} {...page}>
            <Head>
                <title>404 - Page Not Found</title>
            </Head>
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <h1 className="text-8xl font-bold mb-4 text-[var(--theme-primary)]">404</h1>
                <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
                <p className="mb-8 text-lg max-w-md text-gray-600 dark:text-gray-300">
                    The page you are looking for might have been removed, had its name changed, or is temporarily
                    unavailable.
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-80 transition-opacity"
                >
                    Go Home
                </Link>
            </div>
        </BaseLayout>
    );
}

export async function getStaticProps() {
    const allData = allContent();
    const global = createGlobalProps(allData);
    return { props: { global } };
}
