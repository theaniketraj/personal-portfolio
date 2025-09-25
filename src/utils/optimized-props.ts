import { ContentObject, GlobalProps, PageComponentProps } from '@/types';
import { performance as perfUtils } from './performance';

// Cache for frequently accessed data
const globalDataCache = new Map<string, any>();
const contentCache = new Map<string, any>();

export function createOptimizedProps(urlPath: string, allData: ContentObject[]): PageComponentProps {
    const timer = perfUtils.measurePageBuild(urlPath);

    // Get cached global data or create it
    let globalProps: GlobalProps;
    const globalCacheKey = 'global';

    if (globalDataCache.has(globalCacheKey)) {
        globalProps = globalDataCache.get(globalCacheKey);
    } else {
        const siteConfig = allData.find((obj) => obj.__metadata.modelName === 'Config');
        const themeConfig = allData.find((obj) => obj.__metadata.modelName === 'ThemeStyle');

        globalProps = {
            site: siteConfig
                ? {
                      type: siteConfig.type || 'Config',
                      fixedLabel: (siteConfig as any).fixedLabel || 'Personal Portfolio',
                      favicon: (siteConfig as any).favicon || '/favicon.svg',
                      titleSuffix: (siteConfig as any).titleSuffix || ' | Personal Portfolio',
                      defaultSocialImage: (siteConfig as any).defaultSocialImage || null,
                      defaultMetaTags: ((siteConfig as any).defaultMetaTags || []).slice(0, 3),
                      header: (siteConfig as any).header || null,
                      footer: (siteConfig as any).footer || null,
                      __metadata: {
                          modelName: 'Config',
                          id: siteConfig.__metadata?.id || 'site',
                          ...siteConfig.__metadata
                      }
                  }
                : ({} as any),
            theme: themeConfig || ({} as any)
        };
        globalDataCache.set(globalCacheKey, globalProps);
    }

    // Get page content
    const page = allData.find((obj) => obj.__metadata.urlPath === urlPath);
    if (!page) {
        throw new Error(`Page not found: ${urlPath}`);
    }

    // Create minimal page props based on page type
    const pageType = page.__metadata.modelName;
    const optimizedPage = createMinimalPageProps(page, pageType, allData);

    const result = {
        ...optimizedPage,
        global: globalProps
    };

    timer.end();
    perfUtils.measurePayloadSize(result, urlPath);

    return result;
}

function createMinimalPageProps(page: ContentObject, pageType: string, allData: ContentObject[]): any {
    const baseProps = {
        type: pageType,
        title: (page as any).title || 'Page',
        slug: (page as any).slug || '',
        description: (page as any).description || '',
        excerpt: (page as any).excerpt || '',
        date: (page as any).date || null,
        author: (page as any).author || null,
        featuredImage: (page as any).featuredImage || null,
        colors: (page as any).colors || null,
        backgroundImage: (page as any).backgroundImage || null,
        __metadata: page.__metadata
    };

    // Handle different page types with optimized data loading
    switch (pageType) {
        case 'PostLayout':
            return {
                ...baseProps,
                markdownContent: (page as any).markdownContent || '',
                media: (page as any).media || null,
                bottomSections: [] // Remove heavy sections for individual posts
            };

        case 'ProjectLayout':
            return {
                ...baseProps,
                client: (page as any).client || '',
                markdownContent: (page as any).markdownContent || '',
                media: (page as any).media || null,
                bottomSections: [] // Remove heavy sections for individual projects
            };

        case 'PostFeedLayout': {
            const allPosts = getAllPostsOptimized(allData);
            return {
                ...baseProps,
                sections: getOptimizedSections((page as any).sections || [], 3),
                items: allPosts.slice(0, 12), // Limit to recent posts
                postFeed: (page as any).postFeed || {}
            };
        }

        case 'ProjectFeedLayout': {
            const allProjects = getAllProjectsOptimized(allData);
            return {
                ...baseProps,
                sections: getOptimizedSections((page as any).sections || [], 3),
                items: allProjects.slice(0, 12), // Limit to recent projects
                projectFeed: (page as any).projectFeed || {}
            };
        }

        default:
            // For regular pages, optimize sections
            return {
                ...baseProps,
                sections: getOptimizedSections((page as any).sections || [], 5)
            };
    }
}

function getAllPostsOptimized(allData: ContentObject[]): any[] {
    const cacheKey = 'posts-optimized';
    if (contentCache.has(cacheKey)) {
        return contentCache.get(cacheKey);
    }

    const posts = allData
        .filter((obj) => obj.__metadata.modelName === 'PostLayout')
        .map((post) => ({
            type: 'PostLayout',
            title: (post as any).title || '',
            slug: (post as any).slug || '',
            description: (post as any).description || '',
            excerpt: (post as any).excerpt || '',
            featuredImage: (post as any).featuredImage || null,
            date: (post as any).date || null,
            author: (post as any).author || null,
            __metadata: post.__metadata
        }))
        .sort((a, b) => {
            if (!a.date || !b.date) return 0;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

    contentCache.set(cacheKey, posts);
    return posts;
}

function getAllProjectsOptimized(allData: ContentObject[]): any[] {
    const cacheKey = 'projects-optimized';
    if (contentCache.has(cacheKey)) {
        return contentCache.get(cacheKey);
    }

    const projects = allData
        .filter((obj) => obj.__metadata.modelName === 'ProjectLayout')
        .map((project) => ({
            type: 'ProjectLayout',
            title: (project as any).title || '',
            slug: (project as any).slug || '',
            description: (project as any).description || '',
            excerpt: (project as any).excerpt || '',
            featuredImage: (project as any).featuredImage || null,
            date: (project as any).date || null,
            client: (project as any).client || '',
            __metadata: project.__metadata
        }))
        .sort((a, b) => {
            if (!a.date || !b.date) return 0;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

    contentCache.set(cacheKey, projects);
    return projects;
}

function getOptimizedSections(sections: any[], maxSections: number): any[] {
    return sections.slice(0, maxSections).map((section) => ({
        type: section.type || 'Section',
        title: section.title || '',
        subtitle: section.subtitle || '',
        text: (() => {
            if (!section.text) return '';
            return section.text.length > 10000 ? section.text.substring(0, 10000) + '...' : section.text;
        })(),
        colors: section.colors || null,
        variant: section.variant || null,
        elementId: section.elementId || null,
        backgroundSize: section.backgroundSize || null,
        showDate: section.showDate || false,
        showDescription: section.showDescription || false,
        showFeaturedImage: section.showFeaturedImage || false,
        showReadMoreLink: section.showReadMoreLink || false,
        showAuthor: section.showAuthor || false,
        showExcerpt: section.showExcerpt || false,
        styles: section.styles || null,
        actions: (section.actions || []).slice(0, 2),
        posts: (section.posts || []).slice(0, 3).map((post: any) => ({
            type: 'PostLayout',
            title: post.title || '',
            slug: post.slug || '',
            description: post.description || '',
            excerpt: post.excerpt || '',
            featuredImage: post.featuredImage || null,
            date: post.date || null,
            __metadata: post.__metadata || {}
        })),
        projects: (section.projects || []).slice(0, 3).map((project: any) => ({
            type: 'ProjectLayout',
            title: project.title || '',
            slug: project.slug || '',
            description: project.description || '',
            excerpt: project.excerpt || '',
            featuredImage: project.featuredImage || null,
            date: project.date || null,
            __metadata: project.__metadata || {}
        })),
        __metadata: {
            modelName: section.type || 'Section',
            id: section.__metadata?.id || `section-${Math.random()}`,
            ...section.__metadata
        }
    }));
}

// Clear caches periodically or on content changes
export function clearOptimizationCaches(): void {
    globalDataCache.clear();
    contentCache.clear();
}
