import { JSDOM } from 'jsdom';
import { z } from 'zod';
import { getWebMCPToolsManifest } from '../src/lib/webmcp/server-actions';

interface MockTool {
    name: string;
    title?: string;
    description?: string;
    inputSchema?: unknown;
    annotations?: { readOnlyHint?: boolean };
}

async function runBrowserSmokeTest() {
    console.log('=== WebMCP Registration Simulation ===');
    console.log('Note: This suite tests registration lifecycle and schema contracts in a');
    console.log('simulated document.modelContext environment (mocked draft WebMCP API).\n');

    // Setup simulated browser environment
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
    global.document = dom.window.document as unknown as Document;

    // Mock the draft WebMCP document.modelContext API
    const registeredTools: MockTool[] = [];
    (
        global.document as unknown as {
            modelContext: { registerTool: (tool: MockTool) => Promise<void> };
        }
    ).modelContext = {
        registerTool: (tool: MockTool) => {
            registeredTools.push(tool);
            return Promise.resolve();
        }
    };

    // Fetch the manifest (simulating the Server Action call)
    const tools = await getWebMCPToolsManifest();

    // Simulate WebMCPProvider registration logic
    for (const tool of tools) {
        await (
            global.document as unknown as {
                modelContext: { registerTool: (tool: MockTool) => Promise<void> };
            }
        ).modelContext.registerTool({
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

    assert(
        registeredTools.length === tools.length,
        `All ${tools.length} tools were registered with document.modelContext`
    );

    const searchTool = registeredTools.find((t) => t.name === 'search_projects');
    assert(!!searchTool, 'search_projects was registered');
    if (searchTool) {
        assert(!!searchTool.title, 'Registered tool has a title');
        assert(!!searchTool.inputSchema, 'Registered tool has an inputSchema');
        assert(
            typeof searchTool.annotations?.readOnlyHint === 'boolean',
            'Registered tool has readOnlyHint annotation'
        );
    }

    const draftTool = registeredTools.find((t) => t.name === 'draft_contact_message');
    assert(!!draftTool, 'draft_contact_message was registered');
    if (draftTool) {
        assert(
            draftTool.annotations?.readOnlyHint === false,
            'draft_contact_message is correctly marked as not read-only'
        );
    }

    // --- Execution Pipeline & Negative Output Validation Tests ---
    console.log('\n--- Testing Execution Pipeline & Output Schema Enforcement ---');

    // Simulate browser execution wrapper with input and output validation
    const createExecutor = (tool: {
        name: string;
        inputSchema: z.ZodType<any>;
        outputSchema: z.ZodType<any>;
        execute: (args: any) => Promise<any> | any;
    }) => {
        return async (args: any) => {
            try {
                let parsedArgs: any;
                try {
                    parsedArgs = tool.inputSchema.parse(args || {});
                } catch (valErr: any) {
                    return JSON.stringify({
                        isError: true,
                        error: {
                            code: 'INPUT_VALIDATION_ERROR',
                            message: `Error executing tool: ${valErr.message}`
                        }
                    });
                }

                let rawResult: any;
                try {
                    rawResult = await tool.execute(parsedArgs);
                } catch (execErr: any) {
                    return JSON.stringify({
                        isError: true,
                        error: {
                            code: 'EXECUTION_ERROR',
                            message: `Error executing tool: ${execErr.message}`
                        }
                    });
                }

                let validatedResult: any;
                try {
                    validatedResult = tool.outputSchema.parse(rawResult);
                } catch (outErr: any) {
                    return JSON.stringify({
                        isError: true,
                        error: {
                            code: 'OUTPUT_VALIDATION_ERROR',
                            message: `Error executing tool: ${outErr.message}`
                        }
                    });
                }

                return typeof validatedResult === 'object' ? JSON.stringify(validatedResult) : String(validatedResult);
            } catch (error: any) {
                return JSON.stringify({
                    isError: true,
                    error: {
                        code: 'INTERNAL_ERROR',
                        message: `Error executing tool: ${error.message}`
                    }
                });
            }
        };
    };

    // 1. Negative Input Validation Test
    const inputTestExecutor = createExecutor({
        name: 'test_input',
        inputSchema: z.object({ slug: z.string().min(1) }),
        outputSchema: z.object({ success: z.boolean() }),
        execute: () => ({ success: true })
    });
    const inputFailRaw = await inputTestExecutor({ slug: '' });
    const inputFail = JSON.parse(inputFailRaw);
    assert(inputFail.isError === true, 'Input validation failure returns isError: true');
    assert(inputFail.error?.code === 'INPUT_VALIDATION_ERROR', 'Input validation error code is INPUT_VALIDATION_ERROR');

    // 2. Negative Output Validation Test (forces malformed handler output through outputSchema.parse)
    const outputTestExecutor = createExecutor({
        name: 'test_output_enforcement',
        inputSchema: z.object({ id: z.string() }),
        outputSchema: z.object({ title: z.string(), count: z.number() }).strict(),
        execute: () => {
            // Malformed handler output: wrong type for count, extra unexpected field
            return { title: 'Test', count: 'NOT_A_NUMBER', rogueField: true };
        }
    });
    const outputFailRaw = await outputTestExecutor({ id: '123' });
    const outputFail = JSON.parse(outputFailRaw);
    assert(outputFail.isError === true, 'Malformed output correctly rejected with isError: true');
    assert(
        outputFail.error?.code === 'OUTPUT_VALIDATION_ERROR',
        'Output validation error code is OUTPUT_VALIDATION_ERROR'
    );

    // 3. Valid Execution Test
    const validTestExecutor = createExecutor({
        name: 'test_valid',
        inputSchema: z.object({ slug: z.string() }),
        outputSchema: z.object({ slug: z.string(), status: z.string() }),
        execute: (args) => ({ slug: args.slug, status: 'active' })
    });
    const validRaw = await validTestExecutor({ slug: 'valid-slug' });
    const validParsed = JSON.parse(validRaw);
    assert(
        validParsed.slug === 'valid-slug' && validParsed.status === 'active',
        'Valid execution passes output validation and returns parsed object'
    );

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
