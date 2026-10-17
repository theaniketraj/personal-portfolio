'use client';

import { useEffect } from 'react';
import { getWebMCPToolsManifest, getProjectContentAction, getArticleContentAction } from '@/lib/webmcp/server-actions';
import { PortfolioService } from '@/lib/content/portfolio';
import { shouldRegisterToolForRoute } from '@/lib/webmcp/scopes';
import type { ProjectMeta, BlogPostMeta } from '@/lib/content/types';
import type { Profile } from '@/lib/content/profile';
import type { WebMCP } from 'webmcp-types';
import { usePathname } from 'next/navigation';
import { useContactDraft } from './contact-draft-context';
import {
    EmptySchema,
    ProfileOutputSchema,
    SearchProjectsSchema,
    SearchProjectsOutputSchema,
    GetProjectSchema,
    GetProjectOutputSchema,
    GetProjectContentOutputSchema,
    SearchArticlesSchema,
    SearchArticlesOutputSchema,
    GetArticleSchema,
    GetArticleOutputSchema,
    GetArticleContentOutputSchema,
    FindRelevantWorkSchema,
    FindRelevantWorkOutputSchema,
    DraftContactSchema,
    DraftContactOutputSchema
} from '@/lib/webmcp/schemas';
import type { z } from 'zod';

interface WebMCPProviderProps {
    profileData: Profile;
    projectsMeta: ProjectMeta[];
    articlesMeta: BlogPostMeta[];
}

interface BrowserToolDefinition {
    inputSchema: z.ZodType<unknown>;
    outputSchema: z.ZodType<unknown>;
    execute: (args: any) => Promise<unknown> | unknown;
}

export const WebMCPProvider = ({ profileData, projectsMeta, articlesMeta }: WebMCPProviderProps) => {
    const pathname = usePathname();
    const { setDraftData } = useContactDraft();

    useEffect(() => {
        // Current WebMCP spec uses document.modelContext
        const doc = document as unknown as { modelContext: WebMCP.ModelContext };
        const modelContext = doc.modelContext;

        if (modelContext && 'registerTool' in modelContext) {
            const controller = new AbortController();

            const browserTools: Record<string, BrowserToolDefinition> = {
                get_profile: {
                    inputSchema: EmptySchema,
                    outputSchema: ProfileOutputSchema,
                    execute: () => {
                        return PortfolioService.getProfile(projectsMeta.length, articlesMeta.length);
                    }
                },
                search_projects: {
                    inputSchema: SearchProjectsSchema,
                    outputSchema: SearchProjectsOutputSchema,
                    execute: (args) => {
                        return PortfolioService.searchProjects(projectsMeta, args);
                    }
                },
                get_project: {
                    inputSchema: GetProjectSchema,
                    outputSchema: GetProjectOutputSchema,
                    execute: (args) => {
                        const project = PortfolioService.getProjectSummary(projectsMeta, articlesMeta, args.slug);
                        if (!project) return { error: `Project not found: ${args.slug}` };
                        return project;
                    }
                },
                get_project_content: {
                    inputSchema: GetProjectSchema,
                    outputSchema: GetProjectContentOutputSchema,
                    execute: async (args) => {
                        return await getProjectContentAction(args.slug);
                    }
                },
                search_articles: {
                    inputSchema: SearchArticlesSchema,
                    outputSchema: SearchArticlesOutputSchema,
                    execute: (args) => {
                        return PortfolioService.searchArticles(articlesMeta, args);
                    }
                },
                get_article: {
                    inputSchema: GetArticleSchema,
                    outputSchema: GetArticleOutputSchema,
                    execute: (args) => {
                        const article = PortfolioService.getArticleSummary(projectsMeta, articlesMeta, args.slug);
                        if (!article) return { error: `Article not found: ${args.slug}` };
                        return article;
                    }
                },
                get_article_content: {
                    inputSchema: GetArticleSchema,
                    outputSchema: GetArticleContentOutputSchema,
                    execute: async (args) => {
                        return await getArticleContentAction(args.slug);
                    }
                },
                find_relevant_work: {
                    inputSchema: FindRelevantWorkSchema,
                    outputSchema: FindRelevantWorkOutputSchema,
                    execute: (args) => {
                        return PortfolioService.findRelevantWork(projectsMeta, articlesMeta, args);
                    }
                },
                draft_contact_message: {
                    inputSchema: DraftContactSchema,
                    outputSchema: DraftContactOutputSchema,
                    execute: (args) => {
                        // Input validation has ALREADY run and succeeded via DraftContactSchema!
                        // Form state is only mutated after successful validation.
                        setDraftData({
                            firstName: args.firstName,
                            lastName: args.lastName,
                            email: args.email,
                            message: args.message
                        });

                        // Scroll to contact form
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                        }

                        return {
                            success: true,
                            requiresUserReview: true,
                            message:
                                'Contact form draft prepared successfully. The user must manually review and send it.'
                        };
                    }
                }
            };

            getWebMCPToolsManifest()
                .then((tools) => {
                    if (controller.signal.aborted) return;

                    tools.forEach((tool) => {
                        // Context-aware tool registration based on scope
                        if (!shouldRegisterToolForRoute(tool.name, tool.scope, pathname)) {
                            return;
                        }

                        modelContext
                            .registerTool(
                                {
                                    name: tool.name,
                                    title: tool.title, // Pass title to browser
                                    description: tool.description,
                                    inputSchema: tool.inputSchema,
                                    execute: async (
                                        args: Record<string, unknown> | undefined,
                                        options?: { signal?: AbortSignal }
                                    ) => {
                                        try {
                                            const signal = options?.signal;

                                            if (signal?.aborted) {
                                                const error = new Error('Aborted');
                                                error.name = 'AbortError';
                                                throw error;
                                            }

                                            const browserTool = browserTools[tool.name];
                                            if (!browserTool) {
                                                throw new Error('Unknown tool: ' + tool.name);
                                            }

                                            // Unified execution pipeline:
                                            // 1. Input schema validation (prevents mutations or handler run on invalid data)
                                            const safeArgs = args || {};
                                            const parsedArgs = browserTool.inputSchema.parse(safeArgs);

                                            // 2. Client-side handler execution
                                            const rawResult = await browserTool.execute(parsedArgs);

                                            // 3. Output schema validation (ensures runtime output complies with contract)
                                            const validatedResult = browserTool.outputSchema.parse(rawResult);

                                            // 4. Return serialized string according to WebMCP browser convention
                                            return typeof validatedResult === 'object'
                                                ? JSON.stringify(validatedResult)
                                                : String(validatedResult);
                                        } catch (error: unknown) {
                                            console.error(`WebMCP tool ${tool.name} failed:`, error);
                                            const message =
                                                error instanceof Error ? error.message : 'Tool execution failed.';
                                            return `Error executing tool: ${message}`;
                                        }
                                    },
                                    annotations: {
                                        readOnlyHint: tool.readOnly,
                                        ...(tool.untrustedContentHint !== undefined && {
                                            untrustedContentHint: tool.untrustedContentHint
                                        })
                                    }
                                },
                                { signal: controller.signal }
                            )
                            .catch((e: unknown) => {
                                const isAbortError = e instanceof Error && e.name === 'AbortError';
                                if (!isAbortError) {
                                    console.error(`Failed to register tool ${tool.name}:`, e);
                                }
                            });
                    });
                })
                .catch((error) => {
                    if (error.name !== 'AbortError') {
                        console.error('WebMCP registration failed:', error);
                    }
                });

            return () => {
                controller.abort();
            };
        }
    }, [pathname, setDraftData, projectsMeta, articlesMeta, profileData]);

    return null;
};
