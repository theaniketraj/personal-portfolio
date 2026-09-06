import { z } from "zod";

export type ToolScope = "site" | "project-route" | "article-route" | "contact";
export type ToolKind = "query" | "mutation";

export interface ToolDefinition<TInput, TOutput> {
  name: string;
  title: string;
  description: string;
  schema: z.ZodType<TInput>;
  jsonSchema: object;
  outputSchema: z.ZodType<TOutput>;
  scope: ToolScope;
  kind: ToolKind;
  toolVersion: number;
  untrustedContentHint?: boolean;
  handler: (args: TInput) => Promise<TOutput> | TOutput;
}

export class WebMCPRegistry {
  private readonly tools: Map<string, ToolDefinition<unknown, unknown>> =
    new Map();

  registerTool<TInput, TOutput>(tool: ToolDefinition<TInput, TOutput>) {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool with name ${tool.name} already registered`);
    }
    this.tools.set(tool.name, tool as ToolDefinition<unknown, unknown>);
  }

  getTool(name: string): ToolDefinition<unknown, unknown> | undefined {
    return this.tools.get(name);
  }

  getAllTools(): ToolDefinition<unknown, unknown>[] {
    return Array.from(this.tools.values());
  }

  async executeTool(name: string, args: unknown): Promise<unknown> {
    const tool = this.getTool(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    const parsedArgs = tool.schema.parse(args);
    return await tool.handler(parsedArgs);
  }
}

export const registry = new WebMCPRegistry();

export function isWebMCPSupported(): boolean {
  if (typeof document === "undefined") return false;
  const doc = document as unknown as { modelContext?: unknown };
  return !!doc.modelContext;
}

export async function getWebMCPRuntimeTools(): Promise<unknown[] | null> {
  if (typeof document === "undefined") return null;
  const doc = document as unknown as {
    modelContext?: { getTools?: () => Promise<unknown[]> };
  };
  if (doc.modelContext?.getTools) {
    try {
      return await doc.modelContext.getTools();
    } catch {
      return null;
    }
  }
  return null;
}
