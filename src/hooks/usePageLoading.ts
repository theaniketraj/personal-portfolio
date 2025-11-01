import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface LoadingStateConfig {
    // Minimum time to show skeleton (ms) - for smooth transitions
    minLoadingTime?: number;
    // Maximum time before timeout (ms)
    loadingTimeout?: number;
}

/**
 * Hook to manage page loading state with skeleton screens
 * Returns true while page is loading/mounting
 */
export const usePageLoading = (config: LoadingStateConfig = {}) => {
    const { minLoadingTime = 300, loadingTimeout = 5000 } = config;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let loadingTimer: NodeJS.Timeout;
        let timeoutTimer: NodeJS.Timeout;

        const handleRouteChangeStart = () => {
            // Show loading immediately
            setIsLoading(true);

            // Clear any existing timeouts
            clearTimeout(loadingTimer);
            clearTimeout(timeoutTimer);

            // Set maximum timeout to ensure loading state doesn't stay forever
            timeoutTimer = setTimeout(() => {
                setIsLoading(false);
            }, loadingTimeout);
        };

        const handleRouteChangeComplete = () => {
            // Ensure minimum loading time for smooth transition
            loadingTimer = setTimeout(() => {
                setIsLoading(false);
            }, minLoadingTime);

            // Clear timeout
            clearTimeout(timeoutTimer);
        };

        const handleRouteChangeError = () => {
            setIsLoading(false);
            clearTimeout(loadingTimer);
            clearTimeout(timeoutTimer);
        };

        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);
        router.events.on('routeChangeError', handleRouteChangeError);

        return () => {
            clearTimeout(loadingTimer);
            clearTimeout(timeoutTimer);
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            router.events.off('routeChangeError', handleRouteChangeError);
        };
    }, [router.events, minLoadingTime, loadingTimeout]);

    return isLoading;
};

/**
 * Hook to manage component mounting state
 * Returns true while component is mounted and SSR hydration is complete
 */
export const useIsMounted = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted;
};

/**
 * Combined hook for handling both page loading and hydration
 */
export const usePageContentReady = () => {
    const isMounted = useIsMounted();
    const isPageLoading = usePageLoading();

    return isMounted && !isPageLoading;
};
