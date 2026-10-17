'use server';

import { registry } from './registry';
import './actions';

export async function getWebMCPToolsManifest() {
    await Promise.resolve();
    return registry.getAllTools().map((tool) => {
        return {
            name: tool.name,
            title: tool.title,
            description: tool.description,
            scope: tool.scope,
            readOnly: tool.kind === 'query',
            ...(tool.untrustedContentHint !== undefined && {
                untrustedContentHint: tool.untrustedContentHint
            }),
            inputSchema: structuredClone(tool.jsonSchema)
        };
    });
}

export async function getProjectContentAction(slug: string) {
    const result = await registry.executeTool('get_project_content', { slug });
    return structuredClone(result);
}

export async function getArticleContentAction(slug: string) {
    const result = await registry.executeTool('get_article_content', { slug });
    return structuredClone(result);
}
