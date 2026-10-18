import { ToolScope } from './registry';

export function shouldRegisterToolForRoute(toolName: string, toolScope: ToolScope, pathname: string): boolean {
    if (toolScope === 'site') return true;

    if (toolScope === 'contact') {
        return pathname === '/';
    }

    if (toolScope === 'project-list') {
        return pathname === '/projects';
    }

    if (toolScope === 'project-detail') {
        return (
            pathname.startsWith('/projects/') &&
            pathname.length > '/projects/'.length &&
            !pathname.startsWith('/projects/tags/') &&
            !pathname.startsWith('/projects/deprecated')
        );
    }

    if (toolScope === 'article-list') {
        return pathname === '/blog';
    }

    if (toolScope === 'article-detail') {
        return (
            pathname.startsWith('/blog/') && pathname.length > '/blog/'.length && !pathname.startsWith('/blog/tags/')
        );
    }

    // Backward-compatible fallback for legacy composite scopes
    if (toolScope === 'project-route') {
        const isProjectList = pathname === '/projects';
        const isProjectDetail =
            pathname.startsWith('/projects/') &&
            pathname.length > '/projects/'.length &&
            !pathname.startsWith('/projects/tags/') &&
            !pathname.startsWith('/projects/deprecated');

        if (toolName === 'search_projects') return isProjectList;
        return isProjectDetail;
    }

    if (toolScope === 'article-route') {
        const isArticleList = pathname === '/blog';
        const isArticleDetail =
            pathname.startsWith('/blog/') && pathname.length > '/blog/'.length && !pathname.startsWith('/blog/tags/');

        if (toolName === 'search_articles') return isArticleList;
        return isArticleDetail;
    }

    return false;
}
