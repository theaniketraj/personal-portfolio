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
            
            // Create a much more aggressive minimal version
            const minimalProps = {
                // Keep essential page data
                ...(propsAny.page && { page: propsAny.page }),
                ...(propsAny.site && { site: propsAny.site }),
                ...(propsAny.config && { config: propsAny.config }),
                
                // Drastically reduce global data
                global: {
                    site: {
                        type: propsAny.global?.site?.type || 'unknown',
                        fixedLabel: propsAny.global?.site?.fixedLabel || null,
                        favicon: propsAny.global?.site?.favicon || null,
                        titleSuffix: propsAny.global?.site?.titleSuffix || null,
                        defaultSocialImage: propsAny.global?.site?.defaultSocialImage || null,
                        // Remove all defaultMetaTags to save space
                        defaultMetaTags: [],
                        __metadata: propsAny.global?.site?.__metadata || {}
                    }
                }
            };
            
            // Remove large arrays completely or keep only 1-2 items
            const minimalAny = minimalProps as any;
            
            // Keep only the first section to preserve layout
            if (propsAny.sections && Array.isArray(propsAny.sections)) {
                minimalAny.sections = [propsAny.sections[0]].filter(Boolean).map(section => ({
                    type: section.type,
                    title: section.title,
                    subtitle: section.subtitle,
                    // Remove all projects and posts arrays
                    projects: [],
                    posts: []
                }));
            }
            
            // Remove all posts and projects arrays
            minimalAny.posts = [];
            minimalAny.projects = [];
            
            // Remove all heavy content
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
