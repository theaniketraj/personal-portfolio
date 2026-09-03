"use client";

import React, { useEffect, useState } from "react";
import {
  getWebMCPToolsManifest,
  executeWebMCPTool,
} from "@/lib/webmcp/server-actions";

import { usePathname } from "next/navigation";

export const WebMCPProvider = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const nav = navigator as any;
    const doc = document as any;
    const modelContext = doc.modelContext ?? nav.modelContext;

    if (modelContext && "registerTool" in modelContext) {
      const controller = new AbortController();

      getWebMCPToolsManifest().then((tools) => {
        tools.forEach((tool) => {
          // Context-aware tool registration by route
          if (tool.name === "get_project" && !pathname.startsWith("/projects"))
            return;
          if (tool.name === "get_article" && !pathname.startsWith("/blog"))
            return;
          if (tool.name === "draft_contact_message" && pathname !== "/") return;

          modelContext.registerTool(
            {
              name: tool.name,
              description: tool.description,
              inputSchema: tool.inputSchema,
              execute: async (args: any) => {
                if (tool.name === "draft_contact_message") {
                  // Fill out contact form on the client
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                    // Give smooth scroll a moment before filling inputs
                    setTimeout(() => {
                      (
                        document.getElementById("firstName") as HTMLInputElement
                      ).value = args.firstName || "";
                      (
                        document.getElementById("lastName") as HTMLInputElement
                      ).value = args.lastName || "";
                      (
                        document.getElementById("email") as HTMLInputElement
                      ).value = args.email || "";
                      (
                        document.getElementById(
                          "message",
                        ) as HTMLTextAreaElement
                      ).value = args.message || "";
                    }, 500);
                  }
                }
                return await executeWebMCPTool(tool.name, args);
              },
              annotations: {
                readOnlyHint: tool.name !== "draft_contact_message", // draft_contact_message is write (requires human confirmation)
              },
            },
            { signal: controller.signal },
          ).catch((e: any) => {
            if (e?.name !== "AbortError") {
              console.error(`Failed to register tool ${tool.name}:`, e);
            }
          });
        });
        setIsRegistered(true);
      }).catch((error) => {
        if (error.name !== "AbortError") {
          console.error("WebMCP registration failed:", error);
        }
      });

      return () => {
        controller.abort();
      };
    }
  }, [pathname]);

  if (!isRegistered) return null;

  return null;
};
