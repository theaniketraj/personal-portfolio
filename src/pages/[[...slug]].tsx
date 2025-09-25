import Head from 'next/head';
import React from 'react';

import { DynamicComponent } from '@/components/components-registry';
import { PageComponentProps } from '@/types';
import { allContent } from '@/utils/content';
import { createOptimizedProps } from '@/utils/optimized-props';
import { seoGenerateMetaDescription, seoGenerateMetaTags, seoGenerateTitle } from '@/utils/seo-utils';

// Simple error boundary component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
    { hasError: boolean; error?: Error }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Page component error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || (() => (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2>Something went wrong loading this page</h2>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
                        {this.state.error?.message || 'Unknown error occurred'}
                    </details>
                </div>
            ));
            return <FallbackComponent error={this.state.error} />;
        }

        return this.props.children;
    }
}

const Page: React.FC<PageComponentProps> = (props) => {
    // Defensive checks to prevent runtime errors
    const global = props?.global || {} as any;
    const site = global?.site || {} as any;
    // Page content is spread at root level in PageComponentProps
    const page = props || {} as any;

    // Safely generate SEO data with fallbacks
    const title = seoGenerateTitle(page, site) || 'Personal Portfolio';
    const metaTags = seoGenerateMetaTags(page, site) || [];
    const metaDescription = seoGenerateMetaDescription(page, site) || '';

    return (
        <>
            <Head>
                <title>{title}</title>
                {metaDescription && <meta name="description" content={metaDescription} />}
                {metaTags.map((metaTag, index) => {
                    if (!metaTag?.property && !metaTag?.content) return null;

                    if (metaTag.format === 'property') {
                        // OpenGraph meta tags (og:*) should be have the format <meta property="og:…" content="…">
                        return <meta key={metaTag.property || index} property={metaTag.property} content={metaTag.content} />;
                    }
                    return <meta key={metaTag.property || index} name={metaTag.property} content={metaTag.content} />;
                })}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {site?.favicon && <link rel="icon" href={site.favicon} />}
            </Head>
            <ErrorBoundary>
                <DynamicComponent {...page} global={global} />
            </ErrorBoundary>
        </>
    );
};

export function getStaticPaths() {
    try {
        // In development, only generate essential paths to speed up dev server
        if (process.env.NODE_ENV === 'development') {
            const essentialPaths = [
                { params: { slug: [] } }, // Homepage
                { params: { slug: ['info'] } },
                { params: { slug: ['blog'] } },
                { params: { slug: ['projects'] } }
            ];

            return {
                paths: essentialPaths,
                fallback: 'blocking'
            };
        }

        // In production, pre-generate critical pages only
        const allData = allContent();

        // Filter for valid pages with proper metadata
        const validPages = allData.filter((obj) => {
            const path = obj?.__metadata?.urlPath;
            return path && typeof path === 'string';
        });

        const criticalPaths = validPages
            .filter((obj) => {
                const path = obj.__metadata.urlPath;
                const isHomePage = path === '/';
                const isStaticPage = path === '/info' || path === '/blog' || path === '/projects';
                const isRecentPost = path?.startsWith('/blog/') &&
                    path !== '/blog' &&
                    (obj as any).date &&
                    new Date((obj as any).date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Recent posts within 90 days

                return isHomePage || isStaticPage || isRecentPost;
            })
            .map((obj) => {
                const path = obj.__metadata.urlPath;
                const slug = path === '/' ? [] : path.split('/').filter(Boolean);

                return {
                    params: { slug }
                };
            })
            .filter((pathObj) => pathObj.params.slug !== undefined); // Ensure slug is defined

        // Ensure we always have at least the homepage
        if (criticalPaths.length === 0) {
            criticalPaths.push({ params: { slug: [] } });
        }

        return {
            paths: criticalPaths,
            fallback: 'blocking' // Use ISR for non-critical pages
        };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        // Fallback to minimal paths on error
        return {
            paths: [
                { params: { slug: [] } }, // Homepage
                { params: { slug: ['info'] } }
            ],
            fallback: 'blocking'
        };
    }
}

export function getStaticProps({ params }) {
    try {
        // Safely handle params and construct URL path
        const slug = params?.slug || [];
        const urlPath = '/' + (Array.isArray(slug) ? slug.join('/') : '');

        console.log(`🔍 Generating page for: ${urlPath}`);

        // Load all content data
        const allData = allContent();

        // Validate that we have data
        if (!allData || !Array.isArray(allData)) {
            console.error('❌ No content data available');
            return { notFound: true };
        }

        // Generate optimized props
        const props = createOptimizedProps(urlPath, allData);

        // Validate props structure
        if (!props || typeof props !== 'object') {
            console.error(`❌ Invalid props generated for ${urlPath}`);
            return { notFound: true };
        }

        // Log payload size for monitoring
        const bytes = Buffer.byteLength(JSON.stringify(props), 'utf8');
        const sizeMB = bytes / (1024 * 1024);
        console.log(`✓ Optimized payload for ${urlPath}: ${Math.round(bytes / 1024)} KB (${sizeMB.toFixed(1)}MB)`);

        // Return static props without ISR (for Netlify compatibility)
        return {
            props
        };

    } catch (error) {
        console.error(`❌ Error in getStaticProps for ${params?.slug || 'unknown'}:`, error);

        // Return a more informative error response
        return {
            notFound: true
        };
    }
}

export default Page;
