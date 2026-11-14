import { ToolScope } from './registry';

export const RESERVED_PROJECT_SEGMENTS = new Set(['deprecated', 'tags']);
export const RESERVED_ARTICLE_SEGMENTS = new Set(['tags']);

export function getPathSegments(pathname: string): string[] {
    const clean = pathname.split('?')[0].split('#')[0];
    return clean.split('/').filter(Boolean);
}

export function isProjectListRoute(segments: string[]): boolean {
    return segments.length === 1 && segments[0] === 'projects';
}

export function isProjectDetailRoute(segments: string[]): boolean {
    return segments.length === 2 && segments[0] === 'projects' && !RESERVED_PROJECT_SEGMENTS.has(segments[1]);
}

export function isArticleListRoute(segments: string[]): boolean {
    return segments.length === 1 && segments[0] === 'blog';
}

export function isArticleDetailRoute(segments: string[]): boolean {
    return segments.length === 2 && segments[0] === 'blog' && !RESERVED_ARTICLE_SEGMENTS.has(segments[1]);
}

export function shouldRegisterToolForRoute(toolName: string, toolScope: ToolScope, pathname: string): boolean {
    if (toolScope === 'site') return true;

    const segments = getPathSegments(pathname);

    if (toolScope === 'contact') {
        return segments.length === 0;
    }

    if (toolScope === 'project-list') {
        return isProjectListRoute(segments);
    }

    if (toolScope === 'project-detail') {
        return isProjectDetailRoute(segments);
    }

    if (toolScope === 'article-list') {
        return isArticleListRoute(segments);
    }

    if (toolScope === 'article-detail') {
        return isArticleDetailRoute(segments);
    }

    // Backward-compatible fallback for legacy composite scopes
    if (toolScope === 'project-route') {
        if (toolName === 'search_projects') return isProjectListRoute(segments);
        return isProjectDetailRoute(segments);
    }

    if (toolScope === 'article-route') {
        if (toolName === 'search_articles') return isArticleListRoute(segments);
        return isArticleDetailRoute(segments);
    }

    return false;
}
