import { performance as perfUtils } from './performance';

/**
 * Smart props optimization that preserves component functionality
 * while reducing payload sizes intelligently
 */

// Cache for global data
const globalCache = new Map<string, any>();

export function createSmartProps(urlPath: string, allData: any[]): any {
    const timer = perfUtils.measurePageBuild(urlPath);

    try {
        // Find the current page
        const page = allData.find((obj) => obj.__metadata?.urlPath === urlPath);
        if (!page) {
            throw new Error(`Page not found: ${urlPath}`);
        }

        // Create optimized global props
        const global = createGlobalProps(allData);

        // Create optimized page props based on page type
        const optimizedPage = optimizePageData(page, allData);

        const result = {
            ...optimizedPage,
            global
        };

        timer.end();
        perfUtils.measurePayloadSize(result, urlPath);

        return result;
    } catch (error) {
        timer.end();
        throw error;
    }
}

export function createGlobalProps(allData: any[]): any {
    const cacheKey = 'global-props';

    if (globalCache.has(cacheKey)) {
        return globalCache.get(cacheKey);
    }

    const siteConfig = allData.find((obj) => obj.__metadata?.modelName === 'Config');
    const themeConfig = allData.find((obj) => obj.__metadata?.modelName === 'ThemeStyle');

    const global = {
        site: siteConfig
            ? {
                  ...siteConfig,
                  // Keep essential site data but trim heavy content
                  header: siteConfig.header ? optimizeNavigation(siteConfig.header) : null,
                  footer: siteConfig.footer ? optimizeNavigation(siteConfig.footer) : null
              }
            : {},
        theme: themeConfig || {}
    };

    globalCache.set(cacheKey, global);
    return global;
}

function optimizePageData(page: any, allData: any[]): any {
    const pageData = { ...page };

    // Optimize sections based on content type
    if (pageData.sections && Array.isArray(pageData.sections)) {
        pageData.sections = pageData.sections.map((section) => optimizeSection(section, allData));
    }

    // For specific page types, apply targeted optimizations
    const pageType = page.__metadata?.modelName;

    switch (pageType) {
        case 'PostLayout':
        case 'ProjectLayout':
            // For individual posts/projects, keep all content but optimize media
            if (pageData.media) {
                pageData.media = optimizeMediaArray(pageData.media);
            }
            break;

        case 'PostFeedLayout': {
            // For post feed pages, populate posts from all available posts
            const allPosts = createPostsFeed(allData);
            // Add items prop that the layout expects
            pageData.items = allPosts.slice(0, 20);
            break;
        }

        case 'ProjectFeedLayout': {
            // For project feed pages, populate projects from all available projects
            const allProjects = createProjectsFeed(allData);
            // Add items prop that the layout expects
            pageData.items = allProjects.slice(0, 15);
            break;
        }
    }

    return pageData;
}

function optimizeSection(section: any, allData: any[]): any {
    const optimizedSection = { ...section };

    // Handle different section types
    switch (section.type) {
        case 'FeaturedProjectsSection':
        case 'ProjectFeedSection':
            if (section.projects && Array.isArray(section.projects)) {
                optimizedSection.projects = resolveAndOptimizeProjects(section.projects, allData);
            }
            break;

        case 'FeaturedPostsSection':
        case 'PostFeedSection':
            if (section.posts && Array.isArray(section.posts)) {
                optimizedSection.posts = resolveAndOptimizePosts(section.posts, allData);
            }
            break;

        case 'TextSection':
            // Trim extremely long text content
            if (section.text && section.text.length > 20000) {
                optimizedSection.text = section.text.substring(0, 20000) + '...';
            }
            break;
    }

    return optimizedSection;
}

function resolveAndOptimizeProjects(projectRefs: any[], allData: any[]): any[] {
    return projectRefs.slice(0, 6).map((projectRef) => {
        // If it's a file reference, resolve it
        if (typeof projectRef === 'string' && projectRef.includes('content/pages/projects/')) {
            const slug = projectRef.replace('content/pages/projects/', '').replace('.md', '');
            const project = allData.find((obj) => obj.__metadata?.modelName === 'ProjectLayout' && obj.slug === slug);

            if (project) {
                return {
                    // Return only essential fields, strip everything else
                    type: project.type || 'ProjectLayout',
                    title: project.title || '',
                    slug: project.slug || '',
                    excerpt: project.excerpt || '',
                    description: project.description || '',
                    date: project.date || null,
                    featuredImage: project.featuredImage || null,
                    client: project.client || '',
                    __metadata: project.__metadata
                };
            }
        }

        // If it's already an object, return only essential fields
        if (typeof projectRef === 'object') {
            return {
                type: projectRef.type || 'ProjectLayout',
                title: projectRef.title || '',
                slug: projectRef.slug || '',
                excerpt: projectRef.excerpt || '',
                description: projectRef.description || '',
                date: projectRef.date || null,
                client: projectRef.client || '',
                featuredImage: projectRef.featuredImage || null,
                __metadata: projectRef.__metadata || {}
            };
        }

        return projectRef;
    });
}

function resolveAndOptimizePosts(postRefs: any[], allData: any[]): any[] {
    return postRefs.slice(0, 6).map((postRef) => {
        // If it's a file reference, resolve it
        if (typeof postRef === 'string' && postRef.includes('content/pages/blog/')) {
            const slug = postRef.replace('content/pages/blog/', '').replace('.md', '');
            const post = allData.find((obj) => obj.__metadata?.modelName === 'PostLayout' && obj.slug === slug);

            if (post) {
                return {
                    // Return only essential fields for featured posts
                    type: post.type || 'PostLayout',
                    title: post.title || '',
                    slug: post.slug || '',
                    excerpt: post.excerpt || '',
                    description: post.description || '',
                    date: post.date || null,
                    author: post.author || null,
                    featuredImage: post.featuredImage || null,
                    __metadata: post.__metadata
                };
            }
        }

        // If it's already an object, return only essential fields
        if (typeof postRef === 'object') {
            return {
                type: postRef.type || 'PostLayout',
                title: postRef.title || '',
                slug: postRef.slug || '',
                excerpt: postRef.excerpt || '',
                description: postRef.description || '',
                date: postRef.date || null,
                author: postRef.author || null,
                featuredImage: postRef.featuredImage || null,
                __metadata: postRef.__metadata || {}
            };
        }

        return postRef;
    });
}

function optimizeNavigation(nav: any): any {
    if (!nav) return nav;

    return {
        ...nav,
        // Keep navigation structure but optimize heavy content
        primaryLinks: nav.primaryLinks ? nav.primaryLinks.slice(0, 10) : [],
        secondaryLinks: nav.secondaryLinks ? nav.secondaryLinks.slice(0, 5) : []
    };
}

function optimizeMediaArray(media: any): any {
    if (!media) return media;

    // Handle both array and single object cases
    if (Array.isArray(media)) {
        // For media arrays, keep first 3 items and optimize them
        return media.slice(0, 3).map((item) => ({
            ...item,
            // Keep essential image data but remove unnecessary metadata
            altText: item?.altText || '',
            caption: item?.caption || ''
        }));
    }

    // For single media objects, just return optimized version
    return {
        ...media,
        altText: media?.altText || '',
        caption: media?.caption || ''
    };
}

function createPostsFeed(allData: any[]): any[] {
    return allData
        .filter((obj) => obj.__metadata?.modelName === 'PostLayout')
        .map((post) => ({
            type: 'PostLayout',
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            description: post.description || '',
            date: post.date || null,
            author: post.author || null,
            featuredImage: post.featuredImage || null,
            media: post.media || null,
            colors: post.colors || null,
            __metadata: post.__metadata
        }))
        .sort((a, b) => {
            if (!a.date || !b.date) return 0;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
}

function createProjectsFeed(allData: any[]): any[] {
    return allData
        .filter((obj) => obj.__metadata?.modelName === 'ProjectLayout')
        .map((project) => ({
            type: 'ProjectLayout',
            title: project.title || '',
            slug: project.slug || '',
            excerpt: project.excerpt || '',
            description: project.description || '',
            date: project.date || null,
            client: project.client || '',
            featuredImage: project.featuredImage || null,
            media: project.media || null,
            colors: project.colors || null,
            __metadata: project.__metadata
        }))
        .sort((a, b) => {
            if (!a.date || !b.date) return 0;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
}

export function clearSmartPropsCache(): void {
    globalCache.clear();
}
