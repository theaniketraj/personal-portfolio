"use server";

import { registry } from "./registry";
import "./actions";

export async function getWebMCPToolsManifest() {
  return registry.getAllTools().map((tool) => {
    return {
      name: tool.name,
      title: tool.title,
      description: tool.description,
      scope: tool.scope,
      readOnly: tool.kind === "query",
      untrustedContentHint: tool.untrustedContentHint,
      inputSchema: tool.jsonSchema,
    };
  });
}

function maskError(error: unknown) {
  console.error(`WebMCP Execution Error:`, error);
  return { error: "Tool execution failed." };
}

export async function executeGetProjectContent(args: unknown) {
  try { return await registry.executeTool("get_project_content", args || {}); }
  catch (error) { return maskError(error); }
}

export async function executeGetArticleContent(args: unknown) {
  try { return await registry.executeTool("get_article_content", args || {}); }
  catch (error) { return maskError(error); }
}

export async function executeDraftContactMessage(args: unknown) {
  try { return await registry.executeTool("draft_contact_message", args || {}); }
  catch (error) { return maskError(error); }
}
