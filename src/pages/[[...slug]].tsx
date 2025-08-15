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
        console.log(`›› props payload size: ${Math.round(bytes/1024)} KB (${sizeMB.toFixed(1)}MB)`);
        
        // If payload is too large (>25MB), strip down the data
        if (bytes > 25 * 1024 * 1024) {
            console.log('Large payload detected, reducing data...');
            
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
            
            // Create a minimal version that preserves essential metadata
            const minimalProps = {
                // Keep essential page data with metadata
                ...(propsAny.page && { 
                    page: {
                        ...propsAny.page,
                        // Ensure metadata is preserved for component functionality
                        __metadata: propsAny.page.__metadata || {}
                    }
                }),
                ...(propsAny.site && { site: propsAny.site }),
                ...(propsAny.config && { config: propsAny.config }),
                
                // Keep global data but reduce heavy content
                global: {
                    ...propsAny.global,
                    site: {
                        ...propsAny.global?.site,
                        // Keep essential metadata for components
                        __metadata: propsAny.global?.site?.__metadata || {},
                        // Reduce defaultMetaTags but keep structure
                        defaultMetaTags: propsAny.global?.site?.defaultMetaTags?.slice(0, 3) || []
                    }
                }
            };
            
            // Remove large arrays but preserve essential structure and metadata
            const minimalAny = minimalProps as any;
            
            // Keep only first few sections but preserve their metadata
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
            
            // Remove only the heaviest content, keep structure
            delete minimalAny.markdownContent;
            delete minimalAny.allPosts;
            delete minimalAny.allProjects;
            delete minimalAny.allPages;
            
            // Clean undefined values to prevent serialization errors
            const cleanedProps = cleanUndefined(minimalProps);
            
            const reducedBytes = Buffer.byteLength(JSON.stringify(cleanedProps), 'utf8');
            const reducedSizeMB = reducedBytes / (1024 * 1024);
            console.log(`›› reduced payload size: ${Math.round(reducedBytes/1024)} KB (${reducedSizeMB.toFixed(1)}MB)`);
            
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
