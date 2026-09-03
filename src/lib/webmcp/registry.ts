import { z } from "zod";

export interface WebMCPTool<T extends z.ZodType = z.ZodType> {
  name: string;
  description: string;
  schema: T;
  handler: (args: z.infer<T>) => Promise<any> | any;
}

export class WebMCPRegistry {
  private readonly tools: Map<string, WebMCPTool> = new Map();

  registerTool<T extends z.ZodType>(tool: WebMCPTool<T>) {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool with name ${tool.name} already registered`);
    }
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): WebMCPTool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): WebMCPTool[] {
    return Array.from(this.tools.values());
  }

  async executeTool(name: string, args: any): Promise<any> {
    const tool = this.getTool(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    const parsedArgs = tool.schema.parse(args);
    return await tool.handler(parsedArgs);
  }
}

export const registry = new WebMCPRegistry();
