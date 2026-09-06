import { registry } from "../src/lib/webmcp/registry";
import "../src/lib/webmcp/actions";
import { getProjects, getBlogPosts } from "../src/lib/mdx";

async function runTests() {
  console.log("=== WebMCP Registry Unit Tests ===\n");
  const tools = registry.getAllTools();
  console.log(`Found ${tools.length} registered tools.\n`);

  const latestProject = getProjects()[0]?.slug || "lawgic";
  const latestArticle = getBlogPosts()[0]?.slug || "tech-stack-wars";

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

  async function testExpectThrow(toolName: string, args: unknown, message: string) {
    try {
      await registry.executeTool(toolName, args);
      console.error(`Assertion Failed: ${message} (Did not throw)`);
      failed++;
    } catch {
      console.log(`Passed: ${message}`);
      passed++;
    }
  }

  // 1. Test Registry Metadata
  console.log("\n--- Testing Registry Contracts ---");
  const toolNames = new Set<string>();
  
  for (const tool of tools) {
    assert(!!tool.name, `Tool has a name`);
    assert(!toolNames.has(tool.name), `Tool ${tool.name} is unique`);
    toolNames.add(tool.name);
    
    assert(!!tool.title, `Tool ${tool.name} has a title`);
    assert(!!tool.description, `Tool ${tool.name} has a description`);
    assert(!!tool.schema, `Tool ${tool.name} has a schema`);
    assert(!!tool.jsonSchema, `Tool ${tool.name} has jsonSchema`);
    assert(!!tool.scope, `Tool ${tool.name} has a scope`);
    assert(tool.kind === 'query' || tool.kind === 'mutation', `Tool ${tool.name} classification correct`);
    assert(typeof tool.toolVersion === 'number', `Tool ${tool.name} defines toolVersion`);
    
    if (tool.name.endsWith("_content")) {
      assert(tool.untrustedContentHint === true, `Tool ${tool.name} untrustedContent classification correct`);
    }
  }

  // 2. Test Invalid Inputs
  console.log("\n--- Testing Invalid Inputs ---");
  await testExpectThrow("get_project", {}, "get_project throws on missing slug");
  await testExpectThrow("get_project", { slug: 123 }, "get_project throws on wrong type for slug");
  await testExpectThrow("search_projects", { status: "invalid_status" }, "search_projects throws on invalid enum");
  await testExpectThrow("search_projects", { limit: 100 }, "search_projects throws on oversized limit");
  await testExpectThrow("search_projects", { query: "a".repeat(101) }, "search_projects throws on oversized query");
  await testExpectThrow("unknown_tool", {}, "executeTool throws on unknown tool");

  // 3. Test Valid Executions and Output Contracts
  console.log("\n--- Testing Valid Executions ---");

  try {
    const searchRes = await registry.executeTool("search_projects", { domain: "AI", limit: 2 }) as unknown[];
    assert(Array.isArray(searchRes), "search_projects returns an array");
    assert(searchRes.length <= 2, "search_projects respects limit");

    const getRes = await registry.executeTool("get_project", { slug: latestProject }) as Record<string, unknown>;
    assert(!!getRes.title, "get_project returns object with title");
    assert(getRes.content === undefined && getRes.body === undefined && getRes.rawMarkdown === undefined, "get_project summary response does not contain full content");

    const searchArtRes = await registry.executeTool("search_articles", { topic: "TypeScript" }) as unknown[];
    assert(Array.isArray(searchArtRes), "search_articles returns an array");

    const getArtRes = await registry.executeTool("get_article", { slug: latestArticle }) as Record<string, unknown>;
    assert(!!getArtRes.title, "get_article returns object with title");
    assert(getArtRes.content === undefined && getArtRes.body === undefined && getArtRes.rawMarkdown === undefined, "get_article summary response does not contain full content");

    const relevantRes = await registry.executeTool("find_relevant_work", { keywords: ["engineering"], limit: 3 }) as Record<string, unknown>;
    assert(Array.isArray(relevantRes.projects) && Array.isArray(relevantRes.articles), "find_relevant_work returns projects and articles arrays");

    const draftRes = await registry.executeTool("draft_contact_message", { firstName: "Test", email: "test@example.com", message: "Hello" }) as Record<string, unknown>;
    assert(draftRes.success === true, "draft_contact_message returns correct status");

    const profileRes = await registry.executeTool("get_profile", {}) as Record<string, unknown>;
    assert(!!profileRes.name, "get_profile returns name property");

  } catch (e: unknown) {
    const error = e as Error;
    console.error(`❌ Unexpected error during valid execution tests:`, error);
    failed++;
  }

  // ---- NEW: Scope Tests ----
  console.log("\n--- Testing Route Scoping ---");
  const { shouldRegisterToolForRoute } = require("../src/lib/webmcp/scopes");
  
  assert(shouldRegisterToolForRoute("get_profile", "site", "/"), "site scope works on /");
  assert(shouldRegisterToolForRoute("get_profile", "site", "/projects"), "site scope works on /projects");

  assert(shouldRegisterToolForRoute("search_projects", "project-route", "/projects"), "search_projects works on /projects");
  assert(!shouldRegisterToolForRoute("search_projects", "project-route", "/projects/lawgic"), "search_projects blocked on /projects/[slug]");
  assert(!shouldRegisterToolForRoute("search_projects", "project-route", "/blog"), "search_projects blocked on /blog");

  assert(!shouldRegisterToolForRoute("get_project", "project-route", "/projects"), "get_project blocked on /projects");
  assert(shouldRegisterToolForRoute("get_project", "project-route", "/projects/lawgic"), "get_project works on /projects/[slug]");
  
  assert(shouldRegisterToolForRoute("search_articles", "article-route", "/blog"), "search_articles works on /blog");
  assert(!shouldRegisterToolForRoute("search_articles", "article-route", "/blog/tech-stack-wars"), "search_articles blocked on /blog/[slug]");
  assert(!shouldRegisterToolForRoute("get_article", "article-route", "/blog"), "get_article blocked on /blog");
  assert(shouldRegisterToolForRoute("get_article", "article-route", "/blog/tech-stack-wars"), "get_article works on /blog/[slug]");

  assert(shouldRegisterToolForRoute("draft_contact_message", "contact", "/"), "contact scope works on /");
  assert(!shouldRegisterToolForRoute("draft_contact_message", "contact", "/projects"), "contact scope blocked on /projects");

  console.log(`\n=== Test Results ===`);
  console.log(`Assertions Passed: ${passed}`);
  if (failed > 0) {
    console.log(`Assertions Failed: ${failed}`);
    process.exit(1);
  } else {
    console.log("All WebMCP registry contracts verified successfully! 🎉");
    process.exit(0);
  }
}

runTests();
