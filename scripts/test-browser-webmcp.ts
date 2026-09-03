import { JSDOM } from "jsdom";
import { getWebMCPToolsManifest } from "../src/lib/webmcp/server-actions";

async function runBrowserSmokeTest() {
  console.log("=== Browser-Level WebMCP Smoke Test ===\n");

  // Setup simulated browser environment
  const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
  global.document = dom.window.document as any;

  // Mock the draft WebMCP document.modelContext API
  const registeredTools: any[] = [];
  (global.document as any).modelContext = {
    registerTool: (tool: any) => {
      registeredTools.push(tool);
      return Promise.resolve();
    }
  };

  // Fetch the manifest (simulating the Server Action call)
  const tools = await getWebMCPToolsManifest();

  // Simulate WebMCPProvider registration logic
  for (const tool of tools) {
    await (global.document as any).modelContext.registerTool({
      name: tool.name,
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: { readOnlyHint: tool.readOnly }
    });
  }

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (!condition) {
      console.error(`Assertion Failed: ${message}`);
      failed++;
    } else {
      console.log(`Passed: ${message}`);
      passed++;
    }
  }

  assert(registeredTools.length === tools.length, `All ${tools.length} tools were registered with document.modelContext`);

  const searchTool = registeredTools.find(t => t.name === "search_projects");
  assert(!!searchTool, "search_projects was registered");
  if (searchTool) {
    assert(!!searchTool.title, "Registered tool has a title");
    assert(!!searchTool.inputSchema, "Registered tool has an inputSchema");
    assert(typeof searchTool.annotations?.readOnlyHint === 'boolean', "Registered tool has readOnlyHint annotation");
  }

  const draftTool = registeredTools.find(t => t.name === "draft_contact_message");
  assert(!!draftTool, "draft_contact_message was registered");
  if (draftTool) {
    assert(draftTool.annotations?.readOnlyHint === false, "draft_contact_message is correctly marked as not read-only");
  }

  console.log(`\n=== Test Results ===`);
  console.log(`Assertions Passed: ${passed}`);
  if (failed > 0) {
    console.log(`Assertions Failed: ${failed}`);
    process.exit(1);
  } else {
    console.log(`All browser WebMCP smoke tests passed successfully! 🎉`);
    process.exit(0);
  }
}

runBrowserSmokeTest();
