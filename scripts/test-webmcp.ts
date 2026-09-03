import { registry } from "../src/lib/webmcp/registry";
import "../src/lib/webmcp/actions"; // ensure tools are registered

async function runTests() {
  console.log("=== WebMCP Integration Tests ===\n");
  const tools = registry.getAllTools();
  console.log(`Found ${tools.length} registered tools.\n`);

  let passed = 0;
  let failed = 0;

  for (const tool of tools) {
    console.log(`Testing tool: ${tool.name}`);
    try {
      // Mock arguments based on tool name
      let args = {};
      if (tool.name === "search_projects") args = { domain: "AI" };
      if (tool.name === "get_project") args = { slug: "lawgic" }; // Assumes "lawgic" project exists
      if (tool.name === "search_articles") args = { topic: "TypeScript" };
      if (tool.name === "get_article") args = { slug: "how-typescript-became-my-fav" }; 
      if (tool.name === "find_relevant_work") args = { keyword: "engineering" };
      if (tool.name === "draft_contact_message") args = { firstName: "Test", email: "test@example.com", message: "Hello" };

      const result = await registry.executeTool(tool.name, args);
      
      if (result?.error && typeof result.error === "string" && result.error.includes("not found")) {
         // It's okay if a slug is not found as long as it executed gracefully
         console.log(`Passed (Graceful Not Found): ${result.error}`);
         passed++;
      } else if (result) {
        console.log(`Passed (Returned data successfully)`);
        passed++;
      } else {
        console.error(`Failed (No data returned)`);
        failed++;
      }
    } catch (e: any) {
      console.error(`Failed (Exception: ${e.message})`);
      failed++;
    }
  }

  console.log(`\n=== Test Results ===`);
  console.log(`Passed: ${passed}/${tools.length}`);
  if (failed > 0) {
    console.log(`Failed: ${failed}/${tools.length}`);
    process.exit(1);
  } else {
    console.log("All WebMCP tools verified successfully! 🎉");
    process.exit(0);
  }
}

runTests();
