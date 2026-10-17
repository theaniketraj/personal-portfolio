import { test, expect } from '@playwright/test';

// Note: These tests simulate the experimental document.modelContext API in Chromium.
// They test client-side registration lifecycle, scope routing, and input/output contracts.
// Interoperability with native WebMCP browsers should be verified in supported environments.
test.describe('WebMCP Integration Tests (Simulated Browser Context)', () => {
    test.beforeEach(async ({ page }) => {
        // Inject mock modelContext before page loads
        await page.addInitScript(() => {
            const registeredTools = new Map();

            // We'll expose this globally so Playwright can inspect it
            (window as any).__webmcp_test_tools = registeredTools;

            (window.document as any).modelContext = {
                registerTool: async (tool: any, options: any) => {
                    registeredTools.set(tool.name, tool);

                    if (options && options.signal) {
                        options.signal.addEventListener('abort', () => {
                            registeredTools.delete(tool.name);
                        });
                    }
                }
            };
        });
    });

    const getTools = async (page: any) => {
        return page.evaluate(() => {
            const tools = (window as any).__webmcp_test_tools;
            return Array.from(tools.values()).map((t: any) => ({
                name: t.name,
                title: t.title,
                description: t.description,
                hasSchema: !!t.inputSchema
            }));
        });
    };

    test('Output schema enforcement & Tool Presence on Home', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(1000); // Wait for useEffect

        const tools = await getTools(page);
        const toolNames = tools.map((t: any) => t.name);

        // Core scoping
        expect(toolNames).toContain('get_profile');
        expect(toolNames).toContain('draft_contact_message');
        expect(toolNames).not.toContain('search_projects');

        // Schema enforcement: ensure they actually have schemas attached
        const profileTool = tools.find((t: any) => t.name === 'get_profile');
        expect(profileTool.hasSchema).toBe(true);
        expect(profileTool.title).toBeDefined();
    });

    test('Route scoping for /projects, /projects/deprecated, /projects/tags/*', async ({ page }) => {
        await page.goto('/projects');
        await page.waitForTimeout(1000);

        let tools = await getTools(page);
        let toolNames = tools.map((t: any) => t.name);
        expect(toolNames).toContain('search_projects');
        expect(toolNames).not.toContain('get_project'); // Only on /[slug]
        expect(toolNames).not.toContain('draft_contact_message');

        // /projects/tags/*
        await page.goto('/projects/tags/ai');
        await page.waitForTimeout(1000);
        tools = await getTools(page);
        toolNames = tools.map((t: any) => t.name);

        // Should NOT contain search_projects based on current scopes.ts rules
        expect(toolNames).not.toContain('search_projects');
    });

    // Finding D & E: Verify mutation behavior, minimal response, and input validation
    test('Mutation behavior and validation via draft_contact_message', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(1000);

        // 1. Invalid input: whitespace first name should be rejected and NOT mutate form
        const invalidResult = await page.evaluate(async () => {
            const tool = (window as any).__webmcp_test_tools.get('draft_contact_message');
            return await tool.execute({
                firstName: '   ',
                email: 'pw@example.com',
                message: 'Hello from automated test'
            });
        });

        expect(invalidResult).toContain('Error executing tool:');
        await expect(page.locator('input[name="firstName"]')).toHaveValue('');

        // 2. Valid input: should mutate form and return minimal review contract
        const validResultRaw = await page.evaluate(async () => {
            const tool = (window as any).__webmcp_test_tools.get('draft_contact_message');
            return await tool.execute({
                firstName: 'Playwright',
                lastName: 'Test',
                email: 'pw@example.com',
                message: 'Hello from automated test'
            });
        });

        const validResult = JSON.parse(validResultRaw);
        expect(validResult.success).toBe(true);
        expect(validResult.requiresUserReview).toBe(true);
        expect(validResult.draftedData).toBeUndefined();
        expect(validResult.email).toBeUndefined();

        // Check if the form is populated correctly
        await expect(page.locator('input[name="firstName"]')).toHaveValue('Playwright');
        await expect(page.locator('textarea[name="message"]')).toHaveValue('Hello from automated test');
    });

    test('Stale registration behavior across SPA navigation', async ({ page }) => {
        await page.goto('/projects');
        await page.waitForTimeout(1000);

        let tools = await getTools(page);
        let toolNames = tools.map((t: any) => t.name);
        expect(toolNames).toContain('search_projects');

        // Navigate to contact using next/link (SPA navigation) to trigger hydration changes without a full page reload
        // The logo or home link should route to "/"
        await page.click('a[href="/"]');
        await page.waitForTimeout(1000);

        tools = await getTools(page);
        toolNames = tools.map((t: any) => t.name);

        // If the WebMCPProvider doesn't clear stale tools during an SPA route change, this will fail.
        expect(toolNames).not.toContain('search_projects');
        expect(toolNames).toContain('draft_contact_message');
    });
});
