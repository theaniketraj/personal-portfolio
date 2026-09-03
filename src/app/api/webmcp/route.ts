import { NextResponse } from "next/server";
import { registry } from "@/lib/webmcp/registry";
import "@/lib/webmcp/actions";

export async function POST(request: Request) {
  try {
    const { toolName, args } = await request.json();
    
    if (!toolName) {
      return NextResponse.json({ error: "toolName is required" }, { status: 400 });
    }

    const result = await registry.executeTool(toolName, args || {});
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`WebMCP Execution Error:`, error);
    return NextResponse.json(
      { error: `WebMCP Execution Error: ${error.message}`, stack: error.stack },
      { status: 500 }
    );
  }
}
