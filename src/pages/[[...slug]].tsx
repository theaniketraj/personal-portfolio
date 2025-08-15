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
        
        // For Visual Editor (development), significantly reduce payload size
        if (process.env.NODE_ENV === 'development') {
            const bytes = Buffer.byteLength(JSON.stringify(props), 'utf8');
            console.log(`›› props payload size: ${Math.round(bytes/1024)} KB`);
            
            // If payload is too large (>50MB), strip down the data
            if (bytes > 50 * 1024 * 1024) {
                console.log('Large payload detected, reducing data for Visual Editor...');
                
                // Create a minimal version of props for Visual Editor
                const minimalProps = {
                    ...props,
                    // Reduce the global data by keeping only essential info
                    global: {
                        ...props.global,
                        // Keep site config but remove heavy content
                        site: {
                            ...props.global.site,
                            // Remove or minimize large arrays
                        }
                    }
                };
                
                // If there are sections with large content, truncate them
                const propsAny = props as any;
                if (propsAny.sections && Array.isArray(propsAny.sections)) {
                    (minimalProps as any).sections = propsAny.sections.slice(0, 3); // Keep only first 3 sections
                }
                
                const reducedBytes = Buffer.byteLength(JSON.stringify(minimalProps), 'utf8');
                console.log(`›› reduced payload size: ${Math.round(reducedBytes/1024)} KB`);
                
                return {
                    props: minimalProps,
                    revalidate: 1
                };
            }
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
