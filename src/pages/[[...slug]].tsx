import Head from 'next/head';

import { DynamicComponent } from '@/components/components-registry';
import { PageComponentProps } from '@/types';
import { allContent } from '@/utils/content';
import { seoGenerateMetaDescription, seoGenerateMetaTags, seoGenerateTitle } from '@/utils/seo-utils';
import { resolveStaticProps } from '@/utils/static-props-resolvers';

const Page: React.FC<PageComponentProps> = (props) => {
    const { global, ...page } = props;
    const { site } = global;
    const title = seoGenerateTitle(page, site);
    const metaTags = seoGenerateMetaTags(page, site);
    const metaDescription = seoGenerateMetaDescription(page, site);

    return (
        <>
            <Head>
                <title>{title}</title>
                {metaDescription && <meta name="description" content={metaDescription} />}
                {metaTags.map((metaTag) => {
                    if (metaTag.format === 'property') {
                        // OpenGraph meta tags (og:*) should be have the format <meta property="og:…" content="…">
                        return <meta key={metaTag.property} property={metaTag.property} content={metaTag.content} />;
                    }
                    return <meta key={metaTag.property} name={metaTag.property} content={metaTag.content} />;
                })}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {site.favicon && <link rel="icon" href={site.favicon} />}
            </Head>
            <DynamicComponent {...props} />
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
            
            // ALWAYS aggressively reduce global data regardless of page type
            const reducedGlobal = {
                site: {
                    type: propsAny.global?.site?.type || 'unknown',
                    fixedLabel: propsAny.global?.site?.fixedLabel || null,
                    favicon: propsAny.global?.site?.favicon || null,
                    titleSuffix: propsAny.global?.site?.titleSuffix || null,
                    defaultSocialImage: propsAny.global?.site?.defaultSocialImage || null,
                    defaultMetaTags: propsAny.global?.site?.defaultMetaTags?.slice(0, 3) || [],
                    __metadata: propsAny.global?.site?.__metadata || {}
                }
            };
            
            // Create a minimal version that preserves essential metadata
            const minimalProps = {
                // Always preserve the entire page object for critical pages
                ...(propsAny.page && { 
                    page: propsAny.page
                }),
                ...(propsAny.site && { site: propsAny.site }),
                ...(propsAny.config && { config: propsAny.config }),
                
                // ALWAYS use reduced global data
                global: reducedGlobal
            };
            
            // Remove large arrays but preserve essential structure and metadata
            const minimalAny = minimalProps as any;
            
            if (isCriticalPage) {
                // Even for critical pages, we need aggressive reduction for memory
                if (propsAny.sections && Array.isArray(propsAny.sections)) {
                    minimalAny.sections = propsAny.sections.slice(0, 3).map(section => ({
                        type: section.type,
                        title: section.title,
                        subtitle: section.subtitle,
                        __metadata: section.__metadata || {},
                        // Keep minimal content for critical pages
                        projects: section.projects?.slice(0, 3).map(project => ({
                            type: project.type,
                            title: project.title,
                            slug: project.slug,
                            __metadata: project.__metadata || {}
                        })) || [],
                        posts: section.posts?.slice(0, 3).map(post => ({
                            type: post.type,
                            title: post.title,
                            slug: post.slug,
                            __metadata: post.__metadata || {}
                        })) || []
                    }));
                }
                
                // Keep minimal posts/projects for critical pages
                minimalAny.posts = propsAny.posts?.slice(0, 5).map(post => ({
                    type: post.type,
                    title: post.title,
                    slug: post.slug,
                    __metadata: post.__metadata || {}
                })) || [];
                
                minimalAny.projects = propsAny.projects?.slice(0, 5).map(project => ({
                    type: project.type,
                    title: project.title,
                    slug: project.slug,
                    __metadata: project.__metadata || {}
                })) || [];
            } else {
                // For non-critical pages, be more aggressive
                if (propsAny.sections && Array.isArray(propsAny.sections)) {
                    minimalAny.sections = propsAny.sections.slice(0, 2).map(section => ({
                        ...section,
                        // Keep metadata for component functionality
                        __metadata: section.__metadata || {},
                        // Drastically reduce content arrays
                        projects: section.projects?.slice(0, 2).map(project => ({
                            ...project,
                            __metadata: project.__metadata || {},
                            // Remove heavy content but keep essential fields
                            content: project.content ? 'Content truncated for memory optimization' : undefined
                        })) || [],
                        posts: section.posts?.slice(0, 2).map(post => ({
                            ...post,
                            __metadata: post.__metadata || {},
                            // Remove heavy content but keep essential fields
                            content: post.content ? 'Content truncated for memory optimization' : undefined
                        })) || []
                    }));
                }
                
                // Keep minimal posts/projects with metadata
                if (propsAny.posts && Array.isArray(propsAny.posts)) {
                    minimalAny.posts = propsAny.posts.slice(0, 3).map(post => ({
                        ...post,
                        __metadata: post.__metadata || {},
                        content: 'Content truncated for memory optimization'
                    }));
                }
                
                if (propsAny.projects && Array.isArray(propsAny.projects)) {
                    minimalAny.projects = propsAny.projects.slice(0, 3).map(project => ({
                        ...project,
                        __metadata: project.__metadata || {},
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
