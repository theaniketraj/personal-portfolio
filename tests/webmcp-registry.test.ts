import { registry } from '../src/lib/webmcp/registry';
import '../src/lib/webmcp/actions';
import { getProjects, getBlogPosts } from '../src/lib/mdx';
import { PortfolioService } from '../src/lib/content/portfolio';
import { ProjectMeta } from '../src/lib/content/types';

async function runTests() {
    console.log('=== WebMCP Registry Unit Tests ===\n');
    const tools = registry.getAllTools();
    console.log(`Found ${tools.length} registered tools.\n`);

    const latestProject = getProjects()[0]?.slug || 'lawgic';
    const latestArticle = getBlogPosts()[0]?.slug || 'tech-stack-wars';

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
    console.log('\n--- Testing Registry Contracts ---');
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

        if (tool.name.endsWith('_content')) {
            assert(tool.untrustedContentHint === true, `Tool ${tool.name} untrustedContent classification correct`);
        }
    }

    // 1b. Test Native Zod 4 Serialized JSON Schema Structure (Finding A)
    console.log('\n--- Testing Native JSON Schema Serialization ---');
    const {
        SearchProjectsJSONSchema,
        DraftContactJSONSchema,
        GetProjectJSONSchema
    } = require('../src/lib/webmcp/schemas');

    const spSchema = SearchProjectsJSONSchema as Record<string, any>;
    assert(spSchema.type === 'object', 'SearchProjectsJSONSchema type is object');
    assert(
        spSchema.additionalProperties === false,
        'SearchProjectsJSONSchema enforces additionalProperties false (strictness)'
    );
    assert(spSchema.properties?.query?.maxLength === 100, 'SearchProjectsJSONSchema preserves maxLength: 100 on query');
    assert(
        Array.isArray(spSchema.properties?.status?.enum) && spSchema.properties.status.enum.includes('active'),
        'SearchProjectsJSONSchema serializes status enum correctly'
    );
    assert(
        spSchema.properties?.limit?.minimum === 1 && spSchema.properties?.limit?.maximum === 10,
        'SearchProjectsJSONSchema serializes limit bounds (min: 1, max: 10)'
    );

    const dcSchema = DraftContactJSONSchema as Record<string, any>;
    assert(dcSchema.type === 'object', 'DraftContactJSONSchema type is object');
    assert(
        dcSchema.additionalProperties === false,
        'DraftContactJSONSchema enforces additionalProperties false (strictness)'
    );
    assert(
        dcSchema.properties?.firstName?.minLength === 1,
        'DraftContactJSONSchema enforces minLength: 1 on firstName'
    );
    assert(dcSchema.properties?.message?.minLength === 1, 'DraftContactJSONSchema enforces minLength: 1 on message');
    assert(dcSchema.properties?.email?.format === 'email', 'DraftContactJSONSchema specifies format: email');
    assert(
        Array.isArray(dcSchema.required) &&
            dcSchema.required.includes('firstName') &&
            dcSchema.required.includes('email') &&
            dcSchema.required.includes('message'),
        'DraftContactJSONSchema specifies required fields (firstName, email, message)'
    );

    const gpSchema = GetProjectJSONSchema as Record<string, any>;
    assert(gpSchema.type === 'object', 'GetProjectJSONSchema type is object');
    assert(gpSchema.properties?.slug?.type === 'string', 'GetProjectJSONSchema has string property slug');
    assert(
        Array.isArray(gpSchema.required) && gpSchema.required.includes('slug'),
        'GetProjectJSONSchema requires slug'
    );

    // 2. Test Invalid Inputs
    console.log('\n--- Testing Invalid Inputs ---');
    await testExpectThrow('get_project', {}, 'get_project throws on missing slug');
    await testExpectThrow('get_project', { slug: 123 }, 'get_project throws on wrong type for slug');
    await testExpectThrow('search_projects', { status: 'invalid_status' }, 'search_projects throws on invalid enum');
    await testExpectThrow('search_projects', { limit: 100 }, 'search_projects throws on oversized limit');
    await testExpectThrow('search_projects', { query: 'a'.repeat(101) }, 'search_projects throws on oversized query');
    await testExpectThrow(
        'draft_contact_message',
        { firstName: '', email: 'test@example.com', message: 'Hello' },
        'draft_contact_message throws on empty firstName'
    );
    await testExpectThrow(
        'draft_contact_message',
        { firstName: '   ', email: 'test@example.com', message: 'Hello' },
        'draft_contact_message throws on whitespace firstName'
    );
    await testExpectThrow(
        'draft_contact_message',
        { firstName: 'Test', email: 'invalid-email', message: 'Hello' },
        'draft_contact_message throws on invalid email'
    );
    await testExpectThrow(
        'draft_contact_message',
        { firstName: 'Test', email: 'test@example.com', message: '' },
        'draft_contact_message throws on empty message'
    );
    await testExpectThrow(
        'draft_contact_message',
        { firstName: 'Test', email: 'test@example.com', message: '   ' },
        'draft_contact_message throws on whitespace message'
    );
    await testExpectThrow(
        'draft_contact_message',
        {
            firstName: 'Test',
            email: 'test@example.com',
            message: 'Hello',
            extraField: 'not allowed'
        },
        'draft_contact_message throws on unexpected extra fields (strict)'
    );
    await testExpectThrow('unknown_tool', {}, 'executeTool throws on unknown tool');

    // 3. Test Valid Executions and Output Contracts
    console.log('\n--- Testing Valid Executions ---');

    try {
        const searchRes = (await registry.executeTool('search_projects', {
            domain: 'AI',
            limit: 2
        })) as unknown[];
        assert(Array.isArray(searchRes), 'search_projects returns an array');
        assert(searchRes.length <= 2, 'search_projects respects limit');

        // Regression Tests: Taxonomy Canonicalization & Abbreviations (AI, TS, JS, K8s, Capabilities)
        const aiSearch = (await registry.executeTool('search_projects', {
            query: 'AI'
        })) as Array<{ slug: string }>;
        assert(
            Array.isArray(aiSearch) && aiSearch.some((p) => p.slug === 'lawgic' || p.slug === 'project-karl'),
            "search_projects query 'AI' matches projects with stored AI domain"
        );

        const fullAiSearch = (await registry.executeTool('search_projects', {
            query: 'artificial intelligence'
        })) as Array<{ slug: string }>;
        assert(
            Array.isArray(fullAiSearch) && fullAiSearch.some((p) => p.slug === 'lawgic' || p.slug === 'project-karl'),
            "search_projects query 'artificial intelligence' matches projects stored under 'AI'"
        );

        const crashCapabilitySearch = (await registry.executeTool('search_projects', {
            query: 'Crash Detection'
        })) as Array<{ slug: string }>;
        assert(
            Array.isArray(crashCapabilitySearch) && crashCapabilitySearch.some((p) => p.slug === 'raptor'),
            "search_projects query matches 'Crash Detection' capability on raptor"
        );

        const secretsCapabilitySearch = (await registry.executeTool('search_projects', {
            query: 'Secrets Detection'
        })) as Array<{ slug: string }>;
        assert(
            Array.isArray(secretsCapabilitySearch) && secretsCapabilitySearch.some((p) => p.slug === 'scan'),
            "search_projects query matches 'Secrets Detection' capability on scan"
        );

        const capabilityFilterSearch = (await registry.executeTool('search_projects', {
            capability: 'Crash Detection'
        })) as Array<{ slug: string }>;
        assert(
            Array.isArray(capabilityFilterSearch) && capabilityFilterSearch.some((p) => p.slug === 'raptor'),
            "search_projects capability filter matches 'Crash Detection'"
        );

        // Comprehensive Taxonomy Alias Matrix for AI, TS, JS, K8s
        const mockProjects: ProjectMeta[] = [
            {
                slug: 'proj-ai-short',
                title: 'Project Alpha',
                date: '2026-01-01',
                description: 'An AI system',
                domains: ['AI'],
                technologies: ['Python'],
                engineeringAreas: ['Inference'],
                capabilities: ['Model Evaluation'],
                status: 'active'
            },
            {
                slug: 'proj-ai-full',
                title: 'Project Beta',
                date: '2026-01-02',
                description: 'An intelligent platform',
                domains: ['Artificial Intelligence'],
                technologies: ['Python'],
                engineeringAreas: ['NLP'],
                capabilities: ['Text Generation'],
                status: 'active'
            },
            {
                slug: 'proj-ts-full',
                title: 'Project Gamma',
                date: '2026-01-03',
                description: 'Web application',
                domains: ['Web'],
                technologies: ['TypeScript'],
                engineeringAreas: ['Frontend'],
                capabilities: ['Type Safety'],
                status: 'active'
            },
            {
                slug: 'proj-ts-short',
                title: 'Project Delta',
                date: '2026-01-04',
                description: 'Tooling system',
                domains: ['Developer Tools'],
                technologies: ['TS'],
                engineeringAreas: ['Compilers'],
                capabilities: ['Static Analysis'],
                status: 'active'
            },
            {
                slug: 'proj-js-full',
                title: 'Project Epsilon',
                date: '2026-01-05',
                description: 'Interactive dashboard',
                domains: ['Web'],
                technologies: ['JavaScript'],
                engineeringAreas: ['Frontend'],
                capabilities: ['Realtime Charts'],
                status: 'active'
            },
            {
                slug: 'proj-js-short',
                title: 'Project Zeta',
                date: '2026-01-06',
                description: 'Lightweight runtime',
                domains: ['Systems'],
                technologies: ['JS'],
                engineeringAreas: ['Runtime'],
                capabilities: ['Script Execution'],
                status: 'active'
            },
            {
                slug: 'proj-k8s-full',
                title: 'Project Eta',
                date: '2026-01-07',
                description: 'Cluster management',
                domains: ['Infrastructure'],
                technologies: ['Kubernetes'],
                engineeringAreas: ['DevOps'],
                capabilities: ['Pod Scheduling'],
                status: 'active'
            },
            {
                slug: 'proj-k8s-short',
                title: 'Project Theta',
                date: '2026-01-08',
                description: 'Automation operator',
                domains: ['DevOps'],
                technologies: ['K8s'],
                engineeringAreas: ['Cloud Native'],
                capabilities: ['Auto Scaling'],
                status: 'active'
            }
        ];

        const searchAiQuery = PortfolioService.searchProjects(mockProjects, {
            query: 'AI'
        });
        assert(
            searchAiQuery.some((p) => p.slug === 'proj-ai-short') &&
                searchAiQuery.some((p) => p.slug === 'proj-ai-full'),
            "searchProjects query 'AI' matches both stored 'AI' and 'Artificial Intelligence'"
        );

        const searchAiFullQuery = PortfolioService.searchProjects(mockProjects, {
            query: 'artificial intelligence'
        });
        assert(
            searchAiFullQuery.some((p) => p.slug === 'proj-ai-short') &&
                searchAiFullQuery.some((p) => p.slug === 'proj-ai-full'),
            "searchProjects query 'artificial intelligence' matches both stored 'AI' and 'Artificial Intelligence'"
        );

        const searchTsQuery = PortfolioService.searchProjects(mockProjects, {
            query: 'TS'
        });
        assert(
            searchTsQuery.some((p) => p.slug === 'proj-ts-short') &&
                searchTsQuery.some((p) => p.slug === 'proj-ts-full'),
            "searchProjects query 'TS' matches both stored 'TS' and 'TypeScript'"
        );

        const searchTsFullQuery = PortfolioService.searchProjects(mockProjects, {
            query: 'typescript'
        });
        assert(
            searchTsFullQuery.some((p) => p.slug === 'proj-ts-short') &&
                searchTsFullQuery.some((p) => p.slug === 'proj-ts-full'),
            "searchProjects query 'typescript' matches both stored 'TS' and 'TypeScript'"
        );

        const searchJsQuery = PortfolioService.searchProjects(mockProjects, {
            query: 'JS'
        });
        assert(
            searchJsQuery.some((p) => p.slug === 'proj-js-short') &&
                searchJsQuery.some((p) => p.slug === 'proj-js-full'),
            "searchProjects query 'JS' matches both stored 'JS' and 'JavaScript'"
        );

        const searchJsFullQuery = PortfolioService.searchProjects(mockProjects, {
            query: 'javascript'
        });
        assert(
            searchJsFullQuery.some((p) => p.slug === 'proj-js-short') &&
                searchJsFullQuery.some((p) => p.slug === 'proj-js-full'),
            "searchProjects query 'javascript' matches both stored 'JS' and 'JavaScript'"
        );

        const searchK8sQuery = PortfolioService.searchProjects(mockProjects, {
            query: 'K8s'
        });
        assert(
            searchK8sQuery.some((p) => p.slug === 'proj-k8s-short') &&
                searchK8sQuery.some((p) => p.slug === 'proj-k8s-full'),
            "searchProjects query 'K8s' matches both stored 'K8s' and 'Kubernetes'"
        );

        const searchK8sFullQuery = PortfolioService.searchProjects(mockProjects, {
            query: 'kubernetes'
        });
        assert(
            searchK8sFullQuery.some((p) => p.slug === 'proj-k8s-short') &&
                searchK8sFullQuery.some((p) => p.slug === 'proj-k8s-full'),
            "searchProjects query 'kubernetes' matches both stored 'K8s' and 'Kubernetes'"
        );

        const searchCapQuery = PortfolioService.searchProjects(mockProjects, {
            query: 'Auto Scaling'
        });
        assert(
            searchCapQuery.some((p) => p.slug === 'proj-k8s-short'),
            "searchProjects query 'Auto Scaling' matches stored capability"
        );

        const filterCap = PortfolioService.searchProjects(mockProjects, {
            capability: 'Pod Scheduling'
        });
        assert(
            filterCap.some((p) => p.slug === 'proj-k8s-full'),
            "searchProjects filter capability 'Pod Scheduling' matches correctly"
        );

        const getRes = (await registry.executeTool('get_project', {
            slug: latestProject
        })) as Record<string, unknown>;
        assert(!!getRes.title, 'get_project returns object with title');
        assert(
            getRes.content === undefined && getRes.body === undefined && getRes.rawMarkdown === undefined,
            'get_project summary response does not contain full content'
        );

        // Finding C: get_project_content successful and error executions through registry
        const projContentRes = (await registry.executeTool('get_project_content', {
            slug: latestProject
        })) as Record<string, unknown>;
        assert(typeof projContentRes.content === 'string', 'get_project_content returns content string');
        assert(
            typeof (projContentRes.meta as Record<string, unknown>)?.slug === 'string',
            'get_project_content meta includes slug'
        );
        assert(
            Array.isArray((projContentRes.meta as Record<string, unknown>)?.tags),
            'get_project_content validates full metadata (e.g. tags) cleanly'
        );

        const projContentNotFound = (await registry.executeTool('get_project_content', {
            slug: 'nonexistent-slug-404'
        })) as Record<string, unknown>;
        assert(
            typeof projContentNotFound.error === 'string',
            'get_project_content validates not-found error response through registry'
        );

        const searchArtRes = (await registry.executeTool('search_articles', {
            topic: 'TypeScript'
        })) as unknown[];
        assert(Array.isArray(searchArtRes), 'search_articles returns an array');

        const getArtRes = (await registry.executeTool('get_article', {
            slug: latestArticle
        })) as Record<string, unknown>;
        assert(!!getArtRes.title, 'get_article returns object with title');
        assert(
            getArtRes.content === undefined && getArtRes.body === undefined && getArtRes.rawMarkdown === undefined,
            'get_article summary response does not contain full content'
        );

        // Finding C: get_article_content successful and error executions through registry
        const artContentRes = (await registry.executeTool('get_article_content', {
            slug: latestArticle
        })) as Record<string, unknown>;
        assert(typeof artContentRes.content === 'string', 'get_article_content returns content string');
        assert(
            typeof (artContentRes.meta as Record<string, unknown>)?.slug === 'string',
            'get_article_content meta includes slug'
        );
        assert(
            typeof (artContentRes.meta as Record<string, unknown>)?.author === 'string',
            'get_article_content validates full metadata (e.g. author) cleanly'
        );

        const artContentNotFound = (await registry.executeTool('get_article_content', {
            slug: 'nonexistent-article-404'
        })) as Record<string, unknown>;
        assert(
            typeof artContentNotFound.error === 'string',
            'get_article_content validates not-found error response through registry'
        );

        const relevantRes = (await registry.executeTool('find_relevant_work', {
            keywords: ['engineering'],
            limit: 3
        })) as Record<string, unknown>;
        assert(
            Array.isArray(relevantRes.projects) && Array.isArray(relevantRes.articles),
            'find_relevant_work returns projects and articles arrays'
        );

        // Role matching regression tests: AI Engineer, ML Engineer, Backend Engineer, Fullstack Engineer
        const relevantAI = (await registry.executeTool('find_relevant_work', {
            role: 'AI Engineer',
            limit: 3
        })) as { projects: Array<{ project: { slug: string }; matches: string[] }> };
        assert(
            Array.isArray(relevantAI.projects) && relevantAI.projects.length > 0,
            "find_relevant_work with role 'AI Engineer' returns matching projects"
        );
        const aiHasExpectedMatches = relevantAI.projects.some((p) =>
            p.matches.some((m) => ['ai', 'artificial intelligence', 'machine learning', 'ml', 'nlp', 'llm'].includes(m))
        );
        assert(aiHasExpectedMatches, "'AI Engineer' successfully expands to AI/ML/NLP taxonomy terms");

        const relevantML = (await registry.executeTool('find_relevant_work', {
            role: 'ML Engineer',
            limit: 3
        })) as { projects: Array<{ project: { slug: string }; matches: string[] }> };
        assert(
            Array.isArray(relevantML.projects) && relevantML.projects.length > 0,
            "find_relevant_work with role 'ML Engineer' returns matching projects"
        );

        const relevantBackend = (await registry.executeTool('find_relevant_work', {
            role: 'Backend Engineer',
            limit: 3
        })) as { projects: Array<{ project: { slug: string }; matches: string[] }> };
        assert(
            Array.isArray(relevantBackend.projects) && relevantBackend.projects.length > 0,
            "find_relevant_work with role 'Backend Engineer' returns matching projects"
        );

        const relevantFullstack = (await registry.executeTool('find_relevant_work', {
            role: 'Fullstack Engineer',
            limit: 3
        })) as { projects: Array<{ project: { slug: string }; matches: string[] }> };
        assert(
            Array.isArray(relevantFullstack.projects) && relevantFullstack.projects.length > 0,
            "find_relevant_work with role 'Fullstack Engineer' returns matching projects"
        );

        // Finding D: draft_contact_message minimal result
        const draftRes = (await registry.executeTool('draft_contact_message', {
            firstName: 'Test',
            email: 'test@example.com',
            message: 'Hello Aniket'
        })) as Record<string, unknown>;
        assert(draftRes.success === true, 'draft_contact_message returns success: true');
        assert(draftRes.requiresUserReview === true, 'draft_contact_message specifies requiresUserReview: true');
        assert(typeof draftRes.message === 'string', 'draft_contact_message returns user review message');
        assert(
            draftRes.draftedData === undefined && draftRes.email === undefined && draftRes.messageBody === undefined,
            'draft_contact_message returns minimal result without echoing personal contact data'
        );

        const profileRes = (await registry.executeTool('get_profile', {})) as Record<string, unknown>;
        assert(!!profileRes.name, 'get_profile returns name property');
    } catch (e: unknown) {
        const error = e as Error;
        console.error(`❌ Unexpected error during valid execution tests:`, error);
        failed++;
    }

    // ---- NEW: Scope Tests ----
    console.log('\n--- Testing Route Scoping ---');
    const { shouldRegisterToolForRoute } = require('../src/lib/webmcp/scopes');

    // 1. Site scope (global)
    assert(shouldRegisterToolForRoute('get_profile', 'site', '/'), 'site scope works on /');
    assert(shouldRegisterToolForRoute('get_profile', 'site', '/projects'), 'site scope works on /projects');
    assert(shouldRegisterToolForRoute('find_relevant_work', 'site', '/blog'), 'site scope works on /blog');

    // 2. Project List scope
    assert(
        shouldRegisterToolForRoute('search_projects', 'project-list', '/projects'),
        'project-list scope works on /projects'
    );
    assert(
        !shouldRegisterToolForRoute('search_projects', 'project-list', '/projects/lawgic'),
        'project-list scope blocked on /projects/[slug]'
    );
    assert(
        !shouldRegisterToolForRoute('search_projects', 'project-list', '/projects/deprecated'),
        'project-list scope blocked on /projects/deprecated'
    );
    assert(
        !shouldRegisterToolForRoute('search_projects', 'project-list', '/projects/tags/ai'),
        'project-list scope blocked on /projects/tags/[tag]'
    );
    assert(
        !shouldRegisterToolForRoute('search_projects', 'project-list', '/blog'),
        'project-list scope blocked on /blog'
    );

    // 3. Project Detail scope
    assert(
        !shouldRegisterToolForRoute('get_project', 'project-detail', '/projects'),
        'project-detail scope blocked on /projects'
    );
    assert(
        shouldRegisterToolForRoute('get_project', 'project-detail', '/projects/lawgic'),
        'project-detail scope works on /projects/[slug]'
    );
    assert(
        !shouldRegisterToolForRoute('get_project', 'project-detail', '/projects/deprecated'),
        'project-detail scope blocked on /projects/deprecated'
    );
    assert(
        !shouldRegisterToolForRoute('get_project', 'project-detail', '/projects/tags/ai'),
        'project-detail scope blocked on /projects/tags/[tag]'
    );
    assert(
        !shouldRegisterToolForRoute('get_project', 'project-detail', '/blog/tech-stack-wars'),
        'project-detail scope blocked on /blog/[slug]'
    );

    // 4. Article List scope
    assert(shouldRegisterToolForRoute('search_articles', 'article-list', '/blog'), 'article-list scope works on /blog');
    assert(
        !shouldRegisterToolForRoute('search_articles', 'article-list', '/blog/tech-stack-wars'),
        'article-list scope blocked on /blog/[slug]'
    );
    assert(
        !shouldRegisterToolForRoute('search_articles', 'article-list', '/blog/tags/typescript'),
        'article-list scope blocked on /blog/tags/[tag]'
    );
    assert(
        !shouldRegisterToolForRoute('search_articles', 'article-list', '/projects'),
        'article-list scope blocked on /projects'
    );

    // 5. Article Detail scope
    assert(
        !shouldRegisterToolForRoute('get_article', 'article-detail', '/blog'),
        'article-detail scope blocked on /blog'
    );
    assert(
        shouldRegisterToolForRoute('get_article', 'article-detail', '/blog/tech-stack-wars'),
        'article-detail scope works on /blog/[slug]'
    );
    assert(
        !shouldRegisterToolForRoute('get_article', 'article-detail', '/blog/tags/typescript'),
        'article-detail scope blocked on /blog/tags/[tag]'
    );
    assert(
        !shouldRegisterToolForRoute('get_article', 'article-detail', '/projects/lawgic'),
        'article-detail scope blocked on /projects/[slug]'
    );

    // 6. Contact scope
    assert(shouldRegisterToolForRoute('draft_contact_message', 'contact', '/'), 'contact scope works on /');
    assert(
        !shouldRegisterToolForRoute('draft_contact_message', 'contact', '/projects'),
        'contact scope blocked on /projects'
    );
    assert(!shouldRegisterToolForRoute('draft_contact_message', 'contact', '/blog'), 'contact scope blocked on /blog');

    // 7. Backward compatibility for legacy composite scopes
    assert(
        shouldRegisterToolForRoute('search_projects', 'project-route', '/projects'),
        'legacy project-route search_projects works on /projects'
    );
    assert(
        !shouldRegisterToolForRoute('search_projects', 'project-route', '/projects/lawgic'),
        'legacy project-route search_projects blocked on /projects/[slug]'
    );
    assert(
        shouldRegisterToolForRoute('get_project', 'project-route', '/projects/lawgic'),
        'legacy project-route get_project works on /projects/[slug]'
    );
    assert(
        !shouldRegisterToolForRoute('get_project', 'project-route', '/projects'),
        'legacy project-route get_project blocked on /projects'
    );
    assert(
        shouldRegisterToolForRoute('search_articles', 'article-route', '/blog'),
        'legacy article-route search_articles works on /blog'
    );
    assert(
        shouldRegisterToolForRoute('get_article', 'article-route', '/blog/tech-stack-wars'),
        'legacy article-route get_article works on /blog/[slug]'
    );

    console.log(`\n=== Test Results ===`);
    console.log(`Assertions Passed: ${passed}`);
    if (failed > 0) {
        console.log(`Assertions Failed: ${failed}`);
        process.exit(1);
    } else {
        console.log('All WebMCP registry contracts verified successfully! 🎉');
        process.exit(0);
    }
}

runTests();
