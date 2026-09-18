"use client";

import { useEffect } from "react";
import {
  getWebMCPToolsManifest,
  executeGetProjectContent,
  executeGetArticleContent,
  executeDraftContactMessage,
} from "@/lib/webmcp/server-actions";
import { PortfolioService } from "@/lib/content/portfolio";
import { shouldRegisterToolForRoute } from "@/lib/webmcp/scopes";
import type { ProjectMeta, BlogPostMeta } from "@/lib/content/types";
import type { Profile } from "@/lib/content/profile";
import type { WebMCP } from "webmcp-types";
import { usePathname } from "next/navigation";
import { useContactDraft } from "./contact-draft-context";
import {
  SearchProjectsSchema,
  GetProjectSchema,
  SearchArticlesSchema,
  GetArticleSchema,
  FindRelevantWorkSchema,
} from "@/lib/webmcp/schemas";

interface WebMCPProviderProps {
  profileData: Profile;
  projectsMeta: ProjectMeta[];
  articlesMeta: BlogPostMeta[];
}

export const WebMCPProvider = ({
  profileData,
  projectsMeta,
  articlesMeta,
}: WebMCPProviderProps) => {
  const pathname = usePathname();
  const { setDraftData } = useContactDraft();

  useEffect(() => {
    // Current WebMCP spec uses document.modelContext
    const doc = document as unknown as { modelContext: WebMCP.ModelContext };
    const modelContext = doc.modelContext;

    if (modelContext && "registerTool" in modelContext) {
      const controller = new AbortController();

      getWebMCPToolsManifest()
        .then((tools) => {
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
                    options?: { signal?: AbortSignal },
                  ) => {
                    try {
                      const safeArgs = args || {};
                      const signal = options?.signal;

                      if (signal?.aborted) {
                        const error = new Error("Aborted");
                        error.name = "AbortError";
                        throw error;
                      }

                      if (tool.name === "draft_contact_message") {
                        // Dispatch context update instead of DOM manipulation
                        setDraftData({
                          firstName: safeArgs.firstName as string | undefined,
                          lastName: safeArgs.lastName as string | undefined,
                          email: safeArgs.email as string | undefined,
                          message: safeArgs.message as string | undefined,
                        });

                        // Scroll to contact form
                        const contactSection =
                          document.getElementById("contact");
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: "smooth" });
                        }
                      }

                      // Route read-only tools directly to the client-side logic
                      let result: unknown;
                      switch (tool.name) {
                        case "get_profile":
                          result = PortfolioService.getProfile(
                            projectsMeta.length,
                            articlesMeta.length,
                          );
                          break;
                        case "search_projects": {
                          const parsedArgs =
                            SearchProjectsSchema.parse(safeArgs);
                          result = PortfolioService.searchProjects(
                            projectsMeta,
                            parsedArgs,
                          );
                          break;
                        }
                        case "get_project": {
                          const parsedArgs = GetProjectSchema.parse(safeArgs);
                          result = PortfolioService.getProjectSummary(
                            projectsMeta,
                            articlesMeta,
                            parsedArgs.slug,
                          );
                          break;
                        }
                        case "get_project_content":
                          result = await executeGetProjectContent(safeArgs);
                          break;
                        case "search_articles": {
                          const parsedArgs =
                            SearchArticlesSchema.parse(safeArgs);
                          result = PortfolioService.searchArticles(
                            articlesMeta,
                            parsedArgs,
                          );
                          break;
                        }
                        case "get_article": {
                          const parsedArgs = GetArticleSchema.parse(safeArgs);
                          result = PortfolioService.getArticleSummary(
                            projectsMeta,
                            articlesMeta,
                            parsedArgs.slug,
                          );
                          break;
                        }
                        case "get_article_content":
                          result = await executeGetArticleContent(safeArgs);
                          break;
                        case "find_relevant_work": {
                          const parsedArgs =
                            FindRelevantWorkSchema.parse(safeArgs);
                          result = PortfolioService.findRelevantWork(
                            projectsMeta,
                            articlesMeta,
                            parsedArgs,
                          );
                          break;
                        }
                        case "draft_contact_message":
                          result = await executeDraftContactMessage(safeArgs);
                          break;
                        default:
                          throw new Error("Unknown tool: " + tool.name);
                      }

                      if (
                        result &&
                        typeof result === "object" &&
                        "error" in result
                      ) {
                        throw new Error("Tool execution failed.");
                      }

                      // Chrome's WebMCP experimental implementation usually expects tool outputs as strings.
                      return typeof result === "object"
                        ? JSON.stringify(result)
                        : String(result);
                    } catch (error: unknown) {
                      console.error(`WebMCP tool ${tool.name} failed:`, error);
                      // Return the error string rather than throwing, to gracefully inform the agent
                      return `Error executing tool: Tool execution failed.`;
                    }
                  },
                  annotations: {
                    readOnlyHint: tool.readOnly,
                    ...(tool.untrustedContentHint !== undefined && {
                      untrustedContentHint: tool.untrustedContentHint,
                    }),
                  },
                },
                { signal: controller.signal },
              )
              .catch((e: unknown) => {
                const isAbortError =
                  e instanceof Error && e.name === "AbortError";
                if (!isAbortError) {
                  console.error(`Failed to register tool ${tool.name}:`, e);
                }
              });
          });
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("WebMCP registration failed:", error);
          }
        });

      return () => {
        controller.abort();
      };
    }
  }, [pathname, setDraftData, projectsMeta, articlesMeta, profileData]);

  return null;
};
