import { PageTransition } from '@/components/motion';
import { PageLoadingSkeleton } from '@/components/skeletons';
import { usePageLoading } from '@/hooks/usePageLoading';
import { generateGlobalCssVariables } from '@/utils/theme-style-utils';
import { useEffect, useState } from 'react';
import '../css/main.css';

export default function MyApp({ Component, pageProps }) {
    const { global, ...page } = pageProps;
    const { theme } = global || {};
    const [isMounted, setIsMounted] = useState(false);
    const isPageLoading = usePageLoading({ minLoadingTime: 300 });

    const cssVars = generateGlobalCssVariables(theme);

    useEffect(() => {
        setIsMounted(true);
        document.body.setAttribute('data-theme', page.colors || 'colors-a');
    }, [page.colors]);

    // Show skeleton while loading or before hydration is complete
    if (!isMounted || isPageLoading) {
        return (
            <>
                <style jsx global>{`
                    :root {
                        ${cssVars}
                    }
                `}</style>
                <PageLoadingSkeleton />
            </>
        );
    }

    return (
        <>
            <style jsx global>{`
                :root {
                    ${cssVars}
                }
            `}</style>
            <PageTransition>
                <Component {...pageProps} />
            </PageTransition>
        </>
    );
}
