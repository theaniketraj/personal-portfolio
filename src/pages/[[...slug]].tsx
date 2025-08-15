import Head from 'next/head';
import React from 'react';

import { DynamicComponent } from '@/components/components-registry';
import { PageComponentProps } from '@/types';
import { allContent } from '@/utils/content';
import { seoGenerateMetaDescription, seoGenerateMetaTags, seoGenerateTitle } from '@/utils/seo-utils';
import { resolveStaticProps } from '@/utils/static-props-resolvers';

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
            return <FallbackComponent error={this.state.error!} />;
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
    
    // Debug logging for homepage
    if (props?.type === 'PageLayout') {
        console.log('Rendering PageLayout with:', {
            type: props.type,
            title: props.title,
            sectionsCount: props.sections?.length || 0,
            hasGlobal: !!global,
            hasHeader: !!global?.site?.header,
            hasFooter: !!global?.site?.footer
        });
    }
    
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
        // In development (Visual Editor), use fallback to reduce initial load
        if (process.env.NODE_ENV === 'development') {
            return { paths: ['/'], fallback: 'blocking' };
        }
        
        const allData = allContent();
        const paths = allData.map((obj) => obj.__metadata.urlPath).filter(Boolean);
        return { paths, fallback: false };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return { paths: [], fallback: false };
    }
}

export function getStaticProps({ params }) {
    try {
        const allData = allContent();
        const urlPath = '/' + (params.slug || []).join('/');
        const props = resolveStaticProps(urlPath, allData);
        
        // Check payload size and reduce if necessary (for both dev and production)
        const bytes = Buffer.byteLength(JSON.stringify(props), 'utf8');
        const sizeMB = bytes / (1024 * 1024);
        
        // Log payload size for debugging
        console.log(`›› props payload size for ${urlPath}: ${Math.round(bytes/1024)} KB (${sizeMB.toFixed(1)}MB)`);
        
        // If payload is too large (>25MB), strip down the data
        if (bytes > 25 * 1024 * 1024) {
            console.log(`Large payload detected for ${urlPath}, reducing data...`);
            
            // Helper function to clean undefined values
            const cleanUndefined = (obj: any): any => {
                if (Array.isArray(obj)) {
                    return obj.map(cleanUndefined);
                } else if (obj && typeof obj === 'object') {
                    const cleaned: any = {};
                    for (const [key, value] of Object.entries(obj)) {
                        if (value !== undefined) {
                            cleaned[key] = cleanUndefined(value);
                        }
                    }
                    return cleaned;
                }
                return obj;
            };
            
            // Type the props properly for minimal data
            const propsAny = props as any;
            
            // For homepage and critical pages, be less aggressive
            const isHomePage = urlPath === '/';
            const isCriticalPage = isHomePage || urlPath === '/info';
            
            console.log(`Processing ${urlPath}, isHomePage: ${isHomePage}, isCriticalPage: ${isCriticalPage}`);
            
            // ALWAYS aggressively reduce global data but preserve essential metadata
            const reducedGlobal = {
                site: {
                    type: propsAny.global?.site?.type || 'Config',
                    fixedLabel: propsAny.global?.site?.fixedLabel || 'Personal Portfolio',
                    favicon: propsAny.global?.site?.favicon || '/favicon.svg',
                    titleSuffix: propsAny.global?.site?.titleSuffix || ' | Personal Portfolio',
                    defaultSocialImage: propsAny.global?.site?.defaultSocialImage || null,
                    defaultMetaTags: propsAny.global?.site?.defaultMetaTags?.slice(0, 3) || [],
                    // PRESERVE HEADER AND FOOTER - Essential for layout
                    header: propsAny.global?.site?.header || null,
                    footer: propsAny.global?.site?.footer || null,
                    // Ensure metadata with modelName is preserved
                    __metadata: {
                        modelName: 'Config',
                        id: propsAny.global?.site?.__metadata?.id || 'site',
                        ...propsAny.global?.site?.__metadata
                    }
                },
                theme: propsAny.global?.theme || null
            };
            
            // Create a minimal version that preserves essential metadata
            const minimalProps = {
                // Spread page content at root level to match PageComponentProps structure
                ...propsAny,
                type: propsAny.type || 'PageLayout', // Ensure type is always present
                title: propsAny.title || 'Page',
                slug: propsAny.slug || '',
                colors: propsAny.colors,
                backgroundImage: propsAny.backgroundImage,
                __metadata: {
                    modelName: propsAny.type || 'PageLayout',
                    id: propsAny.__metadata?.id || 'page',
                    ...propsAny.__metadata
                },
                
                // ALWAYS use reduced global data with preserved metadata
                global: reducedGlobal
            };
            
            // Remove large arrays but preserve essential structure and metadata
            const minimalAny = minimalProps as any;
            
            if (isCriticalPage) {
                // Even for critical pages, we need aggressive reduction for memory
                if (propsAny.sections && Array.isArray(propsAny.sections)) {
                    minimalAny.sections = propsAny.sections.slice(0, 5).map(section => ({
                        // Preserve ALL essential properties for proper rendering
                        type: section.type || 'Section',
                        title: section.title,
                        subtitle: section.subtitle,
                        text: section.text,
                        colors: section.colors,
                        variant: section.variant,
                        elementId: section.elementId,
                        backgroundSize: section.backgroundSize,
                        showDate: section.showDate,
                        showDescription: section.showDescription,
                        showFeaturedImage: section.showFeaturedImage,
                        showReadMoreLink: section.showReadMoreLink,
                        showAuthor: section.showAuthor,
                        showExcerpt: section.showExcerpt,
                        styles: section.styles,
                        actions: section.actions,
                        form: section.form,
                        __metadata: {
                            modelName: section.type || 'Section',
                            id: section.__metadata?.id || `section-${Math.random()}`,
                            ...section.__metadata
                        },
                        // Keep minimal content for critical pages with metadata
                        projects: section.projects?.slice(0, 3).map(project => ({
                            type: project.type || 'Project',
                            title: project.title,
                            slug: project.slug,
                            __metadata: {
                                modelName: project.type || 'Project',
                                id: project.__metadata?.id || project.slug,
                                ...project.__metadata
                            }
                        })) || [],
                        posts: section.posts?.slice(0, 3).map(post => ({
                            type: post.type || 'Post',
                            title: post.title,
                            slug: post.slug,
                            __metadata: {
                                modelName: post.type || 'Post',
                                id: post.__metadata?.id || post.slug,
                                ...post.__metadata
                            }
                        })) || []
                    }));
                }
                
                // Keep minimal posts/projects for critical pages with proper metadata
                minimalAny.posts = propsAny.posts?.slice(0, 5).map(post => ({
                    type: post.type || 'Post',
                    title: post.title,
                    slug: post.slug,
                    __metadata: {
                        modelName: post.type || 'Post',
                        id: post.__metadata?.id || post.slug,
                        ...post.__metadata
                    }
                })) || [];
                
                minimalAny.projects = propsAny.projects?.slice(0, 5).map(project => ({
                    type: project.type || 'Project',
                    title: project.title,
                    slug: project.slug,
                    __metadata: {
                        modelName: project.type || 'Project',
                        id: project.__metadata?.id || project.slug,
                        ...project.__metadata
                    }
                })) || [];
            } else {
                // For non-critical pages, be more aggressive
                if (propsAny.sections && Array.isArray(propsAny.sections)) {
                    minimalAny.sections = propsAny.sections.slice(0, 2).map(section => ({
                        type: section.type || 'Section',
                        title: section.title,
                        subtitle: section.subtitle,
                        // Keep metadata for component functionality with modelName
                        __metadata: {
                            modelName: section.type || 'Section',
                            id: section.__metadata?.id || `section-${Math.random()}`,
                            ...section.__metadata
                        },
                        // Drastically reduce content arrays but preserve metadata
                        projects: section.projects?.slice(0, 2).map(project => ({
                            type: project.type || 'Project',
                            title: project.title,
                            slug: project.slug,
                            __metadata: {
                                modelName: project.type || 'Project',
                                id: project.__metadata?.id || project.slug,
                                ...project.__metadata
                            },
                            // Remove heavy content but keep essential fields
                            content: 'Content truncated for memory optimization'
                        })) || [],
                        posts: section.posts?.slice(0, 2).map(post => ({
                            type: post.type || 'Post',
                            title: post.title,
                            slug: post.slug,
                            __metadata: {
                                modelName: post.type || 'Post',
                                id: post.__metadata?.id || post.slug,
                                ...post.__metadata
                            },
                            // Remove heavy content but keep essential fields
                            content: 'Content truncated for memory optimization'
                        })) || []
                    }));
                }
                
                // Keep minimal posts/projects with metadata including modelName
                if (propsAny.posts && Array.isArray(propsAny.posts)) {
                    minimalAny.posts = propsAny.posts.slice(0, 3).map(post => ({
                        type: post.type || 'Post',
                        title: post.title,
                        slug: post.slug,
                        __metadata: {
                            modelName: post.type || 'Post',
                            id: post.__metadata?.id || post.slug,
                            ...post.__metadata
                        },
                        content: 'Content truncated for memory optimization'
                    }));
                }
                
                if (propsAny.projects && Array.isArray(propsAny.projects)) {
                    minimalAny.projects = propsAny.projects.slice(0, 3).map(project => ({
                        type: project.type || 'Project',
                        title: project.title,
                        slug: project.slug,
                        __metadata: {
                            modelName: project.type || 'Project',
                            id: project.__metadata?.id || project.slug,
                            ...project.__metadata
                        },
                        content: 'Content truncated for memory optimization'
                    }));
                }
            }
            
            // Remove only the heaviest content, keep structure
            delete minimalAny.markdownContent;
            delete minimalAny.allPosts;
            delete minimalAny.allProjects;
            delete minimalAny.allPages;
            
            // Clean undefined values to prevent serialization errors
            const cleanedProps = cleanUndefined(minimalProps);
            
            const reducedBytes = Buffer.byteLength(JSON.stringify(cleanedProps), 'utf8');
            const reducedSizeMB = reducedBytes / (1024 * 1024);
            console.log(`›› reduced payload size for ${urlPath}: ${Math.round(reducedBytes/1024)} KB (${reducedSizeMB.toFixed(1)}MB)`);
            
            // Debug: Log the structure being passed to the component
            if (isHomePage) {
                console.log('Homepage reduced structure:', {
                    type: cleanedProps.type,
                    sectionsCount: cleanedProps.sections?.length || 0,
                    sectionTypes: cleanedProps.sections?.map(s => s.type) || [],
                    hasGlobal: !!cleanedProps.global,
                    hasHeader: !!cleanedProps.global?.site?.header,
                    hasFooter: !!cleanedProps.global?.site?.footer
                });
            }
            
            return {
                props: cleanedProps,
                // In development, enable revalidation for Visual Editor
                ...(process.env.NODE_ENV === 'development' ? { revalidate: 1 } : {})
            };
        }
        
        return { 
            props,
            // In development, enable revalidation for Visual Editor
            ...(process.env.NODE_ENV === 'development' ? { revalidate: 1 } : {})
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            notFound: true
        };
    }
}

export default Page;
