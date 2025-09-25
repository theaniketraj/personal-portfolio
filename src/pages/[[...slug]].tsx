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
        // In development, only generate essential paths
        if (process.env.NODE_ENV === 'development') {
            return {
                paths: ['/', '/info', '/blog'].map(path => ({ params: { slug: path === '/' ? [] : path.split('/').filter(Boolean) } })),
                fallback: 'blocking'
            };
        }

        // In production, be more selective about which paths to pre-generate
        const allData = allContent();
        const criticalPaths = allData
            .filter((obj) => {
                const path = obj.__metadata.urlPath;
                return path === '/' ||
                    path === '/info' ||
                    path === '/blog' ||
                    path === '/projects' ||
                    (path?.startsWith('/blog/') && (obj as any).date && new Date((obj as any).date) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)); // Recent posts only
            })
            .map((obj) => ({
                params: {
                    slug: obj.__metadata.urlPath === '/' ? [] : obj.__metadata.urlPath.split('/').filter(Boolean)
                }
            }));

        return {
            paths: criticalPaths,
            fallback: 'blocking' // Use ISR for other pages
        };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return { paths: [{ params: { slug: [] } }], fallback: 'blocking' };
    }
}

export function getStaticProps({ params }) {
    try {
        const allData = allContent();
        const urlPath = '/' + (params.slug || []).join('/');
        const props = createOptimizedProps(urlPath, allData);

        // Log payload size for monitoring
        const bytes = Buffer.byteLength(JSON.stringify(props), 'utf8');
        const sizeMB = bytes / (1024 * 1024);
        console.log(`✓ Optimized payload for ${urlPath}: ${Math.round(bytes / 1024)} KB (${sizeMB.toFixed(1)}MB)`);

        // Determine revalidation strategy
        const isStaticPage = urlPath === '/' || urlPath === '/info';
        const isBlogPost = urlPath.startsWith('/blog/') && urlPath !== '/blog';
        const isProject = urlPath.startsWith('/projects/') && urlPath !== '/projects';

        let revalidate: number | boolean = false;

        if (process.env.NODE_ENV === 'development') {
            revalidate = 1; // Fast revalidation in development
        } else if (isStaticPage) {
            revalidate = 3600; // 1 hour for static pages
        } else if (isBlogPost || isProject) {
            revalidate = 86400; // 24 hours for blog posts and projects
        } else {
            revalidate = 1800; // 30 minutes for other pages
        }

        return {
            props,
            revalidate
        };

    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            notFound: true
        };
    }
}

export default Page;
