"use server";

import { registry } from "./registry";
import "./actions";
import { zodToJsonSchema } from "zod-to-json-schema";

export async function getWebMCPToolsManifest() {
  return registry.getAllTools().map((tool) => {
    const jsonSchema: any = zodToJsonSchema(tool.schema as any, tool.name);
    const def = jsonSchema.definitions?.[tool.name] || jsonSchema;

    return {
      name: tool.name,
      description: tool.description,
      inputSchema: {
        type: "object",
        properties: def.properties || {},
        required: def.required || [],
      },
    };
  });
}

export async function executeWebMCPTool(toolName: string, args: any) {
  try {
    return await registry.executeTool(toolName, args);
  } catch (error: any) {
    throw new Error(`WebMCP Execution Error (${toolName}): ${error.message}`);
  }
}
