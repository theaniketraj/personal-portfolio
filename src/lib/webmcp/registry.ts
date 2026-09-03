import { z } from "zod";

export type ToolScope = "global" | "project" | "article" | "contact";

export interface ToolDefinition<TInput, TOutput> {
  name: string;
  title: string;
  description: string;
  schema: z.ZodType<TInput>;
  jsonSchema: object;
  scope: ToolScope;
  readOnly: boolean;
  untrustedContentHint?: boolean;
  handler: (args: TInput) => Promise<TOutput> | TOutput;
}

export class WebMCPRegistry {
  private readonly tools: Map<string, ToolDefinition<unknown, unknown>> = new Map();

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
