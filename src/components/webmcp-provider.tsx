"use client";

import { useEffect, useState } from "react";
import { getWebMCPToolsManifest } from "@/lib/webmcp/server-actions";
import type { WebMCP } from "webmcp-types";
import { usePathname } from "next/navigation";
import { useContactDraft } from "./contact-draft-context";

export const WebMCPProvider = () => {
  const [isRegistered, setIsRegistered] = useState(false);
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
            if (tool.scope === "project" && !pathname.startsWith("/projects"))
              return;
            if (tool.scope === "article" && !pathname.startsWith("/blog"))
              return;
            if (tool.scope === "contact" && pathname !== "/") return;

            modelContext
              .registerTool(
                {
                  name: tool.name,
                  title: tool.title, // Pass title to browser
                  description: tool.description,
                  inputSchema: tool.inputSchema,
                  execute: async (args: Record<string, unknown> | undefined, options?: { signal?: AbortSignal }) => {
                    try {
                      const safeArgs = args || {};
                      const signal = options?.signal;
                      if (tool.name === "draft_contact_message") {
                        // Dispatch context update instead of DOM manipulation
                        setDraftData({
                          firstName: safeArgs.firstName as string | undefined,
                          lastName: safeArgs.lastName as string | undefined,
                          email: safeArgs.email as string | undefined,
                          message: safeArgs.message as string | undefined,
                        });

                        // Scroll to contact form
                        const contactSection = document.getElementById("contact");
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: "smooth" });
                        }
                      }

                      // Call the API route, passing the AbortSignal for cancellation
                      const fetchOptions: RequestInit = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ toolName: tool.name, args: safeArgs }),
                      };
                      if (signal) {
                        fetchOptions.signal = signal;
                      }

                      const response = await fetch("/api/webmcp", fetchOptions);

                      if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(
                          errorData.error || `HTTP error ${response.status}`,
                        );
                      }

                      const result = await response.json();
                      // Chrome's WebMCP experimental implementation usually expects tool outputs as strings.
                      return typeof result === "object" ? JSON.stringify(result) : String(result);
                    } catch (error: any) {
                      console.error(`WebMCP tool ${tool.name} failed:`, error);
                      // Return the error string rather than throwing, to gracefully inform the agent
                      return `Error executing tool ${tool.name}: ${error.message}`;
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
              .catch((e: any) => {
                if (e?.name !== "AbortError") {
                  console.error(`Failed to register tool ${tool.name}:`, e);
                }
              });
          });
          setIsRegistered(true);
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
  }, [pathname, setDraftData]);

  if (!isRegistered) return null;

  return null;
};
