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
      readOnly: tool.readOnly,
      untrustedContentHint: tool.untrustedContentHint,
      inputSchema: tool.jsonSchema,
    };
  });
}
