import fs from 'fs';
import path from 'path';
import { getProjects, getProjectBySlug, getBlogPostBySlug, getBlogPosts, slugifyTag } from '../src/lib/mdx';
import { createProjectJsonLd } from '../src/lib/content/project-jsonld';
import { serializeJsonLd } from '../src/lib/jsonld';
import manifest from '../src/app/manifest';

async function runIntegrityChecks() {
    console.log('=== Content Integrity Checks ===\n');

    const projects = getProjects();
    const articles = getBlogPosts();

    const projectSlugs = new Set(projects.map((p) => p.slug));
    const articleSlugs = new Set(articles.map((a) => a.slug));

    const VALID_DOMAINS = new Set([
        'Systems',
        'AI',
        'Security',
        'IoT',
        'Web',
        'DevOps',
        'Infrastructure',
        'Developer Tools',
        'Automation',
        'Data Engineering',
        'LegalTech',
        'Developer Tooling',
        'Mobile',
        'Hardware',
        'Sustainability'
    ]);

    const VALID_TECHNOLOGIES = new Set([
        'Rust',
        'Kotlin',
        'TypeScript',
        'Python',
        'Go',
        'C++',
        'React',
        'Next.js',
        'Docker',
        'Kubernetes',
        'AWS',
        'GCP',
        'PostgreSQL',
        'Redis',
        'C',
        'Java',
        'JavaScript',
        'Node.js',
        'Transformers',
        'Gradle',
        'Machine Learning',
        'ESP32',
        'Firebase',
        'Supabase'
    ]);

    let passed = 0;
    let failed = 0;

    function assert(condition: boolean, message: string) {
        if (!condition) {
            console.error(`Assertion Failed: ${message}`);
            failed++;
        } else {
            passed++;
        }
    }

    console.log(`Checking ${projects.length} projects...`);
    for (const project of projects) {
        assert(!!project.title, `Project ${project.slug} must have a title`);
        assert(!!project.description, `Project ${project.slug} must have a description`);
        assert(!!project.domains && project.domains.length > 0, `Project ${project.slug} must have domains`);
        assert(
            !!project.technologies && project.technologies.length > 0,
            `Project ${project.slug} must have technologies`
        );

        if (project.domains) {
            for (const domain of project.domains) {
                assert(VALID_DOMAINS.has(domain), `Project ${project.slug} has unknown domain: ${domain}`);
            }
        }

        if (project.technologies) {
            for (const tech of project.technologies) {
                assert(VALID_TECHNOLOGIES.has(tech), `Project ${project.slug} has unknown technology: ${tech}`);
            }
        }

        assert(!!project.status, `Project ${project.slug} must have a status`);

        if (project.relatedProjects) {
            for (const rel of project.relatedProjects) {
                assert(projectSlugs.has(rel), `Project ${project.slug} has invalid related project: ${rel}`);
                const relatedProject = projects.find((p) => p.slug === rel);
                if (relatedProject && !relatedProject.relatedProjects?.includes(project.slug)) {
                    console.warn(
                        `Warning: Symmetry Mismatch. Project ${project.slug} references Project ${rel}, but not vice-versa.`
                    );
                }
            }
        }
        if (project.relatedArticles) {
            for (const rel of project.relatedArticles) {
                assert(articleSlugs.has(rel), `Project ${project.slug} has invalid related article: ${rel}`);
                const relatedArticle = articles.find((a) => a.slug === rel);
                if (relatedArticle && !relatedArticle.relatedProjects?.includes(project.slug)) {
                    console.warn(
                        `Warning: Symmetry Mismatch. Project ${project.slug} references Article ${rel}, but not vice-versa.`
                    );
                }
            }
        }

        // Orphan check
        const isOrphan =
            !project.featured &&
            !projects.some((p) => p.relatedProjects?.includes(project.slug)) &&
            !articles.some((a) => a.relatedProjects?.includes(project.slug));
        if (isOrphan) {
            console.warn(
                `Warning: Project ${project.slug} might be orphaned (not featured, not linked by any project/article).`
            );
        }
    }

    console.log('Checking project structured data (JSON-LD) accuracy...');
    for (const projectMeta of projects) {
        const fullProject = getProjectBySlug(projectMeta.slug);
        assert(!!fullProject, `Project ${projectMeta.slug} must load via getProjectBySlug`);
        if (!fullProject) continue;

        const jsonLd = createProjectJsonLd({
            project: fullProject,
            slug: projectMeta.slug,
            relatedProjects: [],
            relatedArticles: []
        });

        assert(jsonLd['@context'] === 'https://schema.org', `${projectMeta.slug} JSON-LD has correct context`);
        assert(typeof jsonLd['@type'] === 'string', `${projectMeta.slug} JSON-LD has valid @type`);
        assert(
            jsonLd['operatingSystem'] !== 'Cross-platform',
            `${projectMeta.slug} does not emit generic 'Cross-platform' operatingSystem`
        );

        if (projectMeta.slug === 'lawgic') {
            assert(jsonLd['@type'] === 'SoftwareApplication', 'Lawgic is typed as SoftwareApplication');
            assert(
                jsonLd['applicationCategory'] === 'BusinessApplication',
                'Lawgic applicationCategory is BusinessApplication'
            );
            assert(!jsonLd['operatingSystem'], 'Lawgic omits unverified operatingSystem');
        } else if (projectMeta.slug === 'lexum') {
            assert(jsonLd['@type'] === 'SoftwareSourceCode', 'Lexum is typed as SoftwareSourceCode');
            assert(jsonLd['programmingLanguage'] === 'Rust', 'Lexum specifies Rust programmingLanguage');
            assert(!jsonLd['applicationCategory'], 'Lexum omits applicationCategory');
            assert(!jsonLd['operatingSystem'], 'Lexum omits operatingSystem');
        } else if (projectMeta.slug === 'plastecure') {
            assert(jsonLd['@type'] === 'CreativeWork', 'Plastecure is typed as CreativeWork');
            assert(!jsonLd['applicationCategory'], 'Plastecure omits applicationCategory');
            assert(!jsonLd['operatingSystem'], 'Plastecure omits operatingSystem');
            assert(!!jsonLd['genre'], 'Plastecure specifies genre');
        } else if (projectMeta.slug === 'project-karl') {
            assert(jsonLd['@type'] === 'SoftwareSourceCode', 'Project KARL is typed as SoftwareSourceCode');
            assert(jsonLd['programmingLanguage'] === 'Kotlin', 'Project KARL specifies Kotlin programmingLanguage');
            assert(jsonLd['runtimePlatform'] === 'JVM / Android', 'Project KARL specifies runtimePlatform');
            assert(!jsonLd['applicationCategory'], 'Project KARL omits applicationCategory');
            assert(!jsonLd['operatingSystem'], 'Project KARL omits operatingSystem');
        } else if (projectMeta.slug === 'raptor') {
            assert(jsonLd['@type'] === 'CreativeWork', 'Raptor is typed as CreativeWork');
            assert(!jsonLd['applicationCategory'], 'Raptor omits applicationCategory');
            assert(!jsonLd['operatingSystem'], 'Raptor omits operatingSystem');
            assert(!!jsonLd['genre'], 'Raptor specifies genre');
        } else if (projectMeta.slug === 'scan') {
            assert(jsonLd['@type'] === 'SoftwareSourceCode', 'SCAN is typed as SoftwareSourceCode');
            assert(jsonLd['programmingLanguage'] === 'Kotlin', 'SCAN specifies Kotlin programmingLanguage');
            assert(jsonLd['runtimePlatform'] === 'Gradle / JVM', 'SCAN specifies Gradle / JVM runtimePlatform');
            assert(!jsonLd['applicationCategory'], 'SCAN omits applicationCategory');
            assert(!jsonLd['operatingSystem'], 'SCAN omits operatingSystem');
        }

        const serialized = serializeJsonLd(jsonLd);
        assert(!serialized.includes('<'), `${projectMeta.slug} serialized JSON-LD must not contain unescaped '<'`);
        assert(
            JSON.parse(serialized)['@context'] === 'https://schema.org',
            `${projectMeta.slug} serialized JSON-LD parses cleanly`
        );
    }

    console.log('Checking hardened JSON-LD serializer against script-injection vectors...');
    const testPayload = {
        title: '</script><script>alert("xss")</script>',
        description: 'Testing <!-- comment --> and <div> HTML tags',
        nested: { inner: '<img src=x onerror=alert(1)>' }
    };
    const testSerialized = serializeJsonLd(testPayload);
    assert(!testSerialized.includes('<'), 'Serialized output must never contain raw "<" character');
    assert(testSerialized.includes('\\u003c/script>'), 'Serialized output replaces "<" with "\\u003c"');
    const parsedBack = JSON.parse(testSerialized);
    assert(parsedBack.title === testPayload.title, 'Deserialized payload title matches exactly');
    assert(parsedBack.nested.inner === testPayload.nested.inner, 'Deserialized nested payload matches exactly');

    console.log(`Checking ${articles.length} articles...`);
    for (const article of articles) {
        assert(!!article.title, `Article ${article.slug} must have a title`);
        assert(!!article.excerpt, `Article ${article.slug} must have an excerpt`);
        assert(!!article.topics && article.topics.length > 0, `Article ${article.slug} must have topics`);

        if (article.relatedProjects) {
            for (const rel of article.relatedProjects) {
                assert(projectSlugs.has(rel), `Article ${article.slug} has invalid related project: ${rel}`);
                const relatedProject = projects.find((p) => p.slug === rel);
                if (relatedProject && !relatedProject.relatedArticles?.includes(article.slug)) {
                    console.warn(
                        `Warning: Symmetry Mismatch. Article ${article.slug} references Project ${rel}, but not vice-versa.`
                    );
                }
            }
        }
        if (article.relatedArticles) {
            for (const rel of article.relatedArticles) {
                assert(articleSlugs.has(rel), `Article ${article.slug} has invalid related article: ${rel}`);
                const relatedArticle = articles.find((a) => a.slug === rel);
                if (relatedArticle && !relatedArticle.relatedArticles?.includes(article.slug)) {
                    console.warn(
                        `Warning: Symmetry Mismatch. Article ${article.slug} references Article ${rel}, but not vice-versa.`
                    );
                }
            }
        }

        // Orphan check
        const isOrphan =
            !projects.some((p) => p.relatedArticles?.includes(article.slug)) &&
            !articles.some((a) => a.relatedArticles?.includes(article.slug));
        if (isOrphan) {
            console.warn(`Warning: Article ${article.slug} might be orphaned (not linked by any project/article).`);
        }
    }

    // --- Tag Slug & Collision Integrity Checks ---
    console.log('Checking tag slugs and collision safety...');
    const URL_SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

    // Unit checks for slugifyTag
    assert(slugifyTag('CI/CD') === 'ci-cd', "slugifyTag('CI/CD') should equal 'ci-cd'");
    assert(slugifyTag('  CI/CD  ') === 'ci-cd', "slugifyTag('  CI/CD  ') should trim and equal 'ci-cd'");
    assert(slugifyTag('UI/UX') === 'ui-ux', "slugifyTag('UI/UX') should equal 'ui-ux'");
    assert(slugifyTag('ui/ux') === 'ui-ux', "slugifyTag('ui/ux') should equal 'ui-ux'");
    assert(slugifyTag('UI / UX Design') === 'ui-ux-design', "slugifyTag('UI / UX Design') should equal 'ui-ux-design'");
    assert(
        slugifyTag('DevOps/SRE/Infrastructure') === 'devops-sre-infrastructure',
        "slugifyTag('DevOps/SRE/Infrastructure') should equal 'devops-sre-infrastructure'"
    );
    assert(
        slugifyTag('Web Architecture') === 'web-architecture',
        "slugifyTag('Web Architecture') should equal 'web-architecture'"
    );
    assert(slugifyTag('') === '', "slugifyTag('') should return empty string");

    // Project tag verification and collision check
    const projectSlugMap = new Map<string, Set<string>>();
    for (const project of projects) {
        if (project.tags) {
            for (const tag of project.tags) {
                const slug = slugifyTag(tag);
                assert(slug.length > 0, `Project ${project.slug} tag '${tag}' must produce a non-empty slug`);
                assert(
                    URL_SLUG_REGEX.test(slug),
                    `Project ${project.slug} tag slug '${slug}' (from '${tag}') must be a valid single-path segment`
                );
                assert(!slug.includes('/'), `Project ${project.slug} tag slug '${slug}' must not contain slashes`);

                if (!projectSlugMap.has(slug)) {
                    projectSlugMap.set(slug, new Set());
                }
                projectSlugMap.get(slug)!.add(tag);
            }
        }
    }

    for (const [slug, tags] of projectSlugMap.entries()) {
        assert(
            tags.size === 1,
            `Project tag collision detected for slug '${slug}': multiple tags map to this slug: ${Array.from(tags).join(', ')}`
        );
    }
    console.log(`Verified ${projectSlugMap.size} unique project tag slugs (0 collisions).`);

    // Article tag verification and collision check
    const articleSlugMap = new Map<string, Set<string>>();
    for (const article of articles) {
        if (article.tags) {
            for (const tag of article.tags) {
                const slug = slugifyTag(tag);
                assert(slug.length > 0, `Article ${article.slug} tag '${tag}' must produce a non-empty slug`);
                assert(
                    URL_SLUG_REGEX.test(slug),
                    `Article ${article.slug} tag slug '${slug}' (from '${tag}') must be a valid single-path segment`
                );
                assert(!slug.includes('/'), `Article ${article.slug} tag slug '${slug}' must not contain slashes`);

                if (!articleSlugMap.has(slug)) {
                    articleSlugMap.set(slug, new Set());
                }
                articleSlugMap.get(slug)!.add(tag);
            }
        }
    }

    for (const [slug, tags] of articleSlugMap.entries()) {
        assert(
            tags.size === 1,
            `Article tag collision detected for slug '${slug}': multiple tags map to this slug: ${Array.from(tags).join(', ')}`
        );
    }
    console.log(`Verified ${articleSlugMap.size} unique article tag slugs (0 collisions).`);

    // --- Table of Contents & Heading ID Checks ---
    console.log('Checking Table of Contents heading ID consistency...');
    const { extractHeadings } = await import('../src/lib/toc');

    for (const project of projects) {
        const fullProject = getProjectBySlug(project.slug);
        if (fullProject) {
            // Heading hierarchy check: MDX body must not define raw # h1 headings outside code blocks
            const lines = fullProject.content.split('\n');
            let inCodeBlock = false;
            for (const line of lines) {
                if (line.trim().startsWith('```')) inCodeBlock = !inCodeBlock;
                if (!inCodeBlock && /^#\s+[^*#\s]|^#\s+\*\*/.test(line.trim())) {
                    assert(
                        false,
                        `Project ${project.slug} contains raw # heading: "${line}". Use ## for section headings.`
                    );
                }
            }

            const headings = extractHeadings(fullProject.content);
            for (const h of headings) {
                assert(!!h.id && h.id.length > 0, `Heading in project ${project.slug} must have valid id: ${h.text}`);
                assert(!h.id.includes(' '), `Heading id '${h.id}' in project ${project.slug} must not contain spaces`);
            }
            // Ensure no project uses deprecated 'go-to' heading
            assert(
                !/^(#{2,3})\s+.*go-to.*$/im.test(fullProject.content),
                `Project ${project.slug} must not contain deprecated 'go-to' heading; use 'Project Resources'`
            );

            // Check if Project Resources heading exists with 'project-resources' id
            if (/^(#{2,3})\s+.*project resources.*$/im.test(fullProject.content)) {
                const resourcesHeading = headings.find((h) => h.text === 'Project Resources');
                assert(
                    !!resourcesHeading,
                    `Project ${project.slug} with Project Resources section must have 'Project Resources' in TOC headings`
                );
                assert(
                    resourcesHeading?.id === 'project-resources',
                    `Project ${project.slug} Project Resources heading must have ID 'project-resources', but got '${resourcesHeading?.id}'`
                );
            }
        }
    }

    for (const article of articles) {
        const fullArticle = getBlogPostBySlug(article.slug);
        if (fullArticle) {
            // Heading hierarchy check: MDX body must not define raw # h1 headings outside code blocks
            const lines = fullArticle.content.split('\n');
            let inCodeBlock = false;
            for (const line of lines) {
                if (line.trim().startsWith('```')) inCodeBlock = !inCodeBlock;
                if (!inCodeBlock && /^#\s+[^*#\s]|^#\s+\*\*/.test(line.trim())) {
                    assert(
                        false,
                        `Article ${article.slug} contains raw # heading: "${line}". Use ## for section headings.`
                    );
                }
            }

            const headings = extractHeadings(fullArticle.content);
            for (const h of headings) {
                assert(!!h.id && h.id.length > 0, `Heading in article ${article.slug} must have valid id: ${h.text}`);
                assert(!h.id.includes(' '), `Heading id '${h.id}' in article ${article.slug} must not contain spaces`);
            }
        }
    }

    // --- Site Configuration & Canonical Origin Checks ---
    console.log('Checking Canonical Site Configuration...');
    const { profileData, getSiteUrl } = await import('../src/lib/content/profile');
    assert(
        typeof profileData.url === 'string' && profileData.url.startsWith('https://'),
        'profileData.url must be a valid https URL'
    );
    assert(
        getSiteUrl('/sitemap.xml') === `${profileData.url}/sitemap.xml`,
        'getSiteUrl must correctly resolve absolute paths'
    );
    assert(getSiteUrl('blog') === `${profileData.url}/blog`, 'getSiteUrl must handle paths without leading slash');
    assert(getSiteUrl() === profileData.url, 'getSiteUrl() without path must return profileData.url');

    // --- Proxy & SEO Header Checks ---
    const { proxy } = await import('../src/proxy');
    const { NextRequest } = await import('next/server');

    const standardRoutes = ['/', '/projects', '/projects/lexum', '/blog', '/agents'];
    for (const route of standardRoutes) {
        const res = proxy(new NextRequest(getSiteUrl(route)));
        assert(
            res.headers.get('X-Robots-Tag') === 'index, follow',
            `Standard route ${route} should receive 'index, follow' X-Robots-Tag`
        );
    }

    const noIndexRoutes = [
        '/projects/tags/nlp',
        '/projects/tags/ai/',
        '/projects/tags/ci-cd',
        '/blog/tags/typescript',
        '/blog/tags/technical/',
        '/blog/tags/ci-cd',
        '/tags/kotlin',
        '/tags/ai/',
        '/tags/ci-cd',
        '/projects/deprecated',
        '/projects/deprecated/'
    ];
    for (const route of noIndexRoutes) {
        const res = proxy(new NextRequest(getSiteUrl(route)));
        assert(
            res.headers.get('X-Robots-Tag') === 'noindex, follow',
            `Noindex route ${route} should receive 'noindex, follow' X-Robots-Tag`
        );
    }

    const staticAssetRes = proxy(new NextRequest(getSiteUrl('/images/icon.png')));
    assert(staticAssetRes.headers.get('X-Robots-Tag') === null, 'Static assets should not receive X-Robots-Tag');

    // --- Proxy Generic Slash-Tag Route Redirect Checks ---
    const slashTagRoutes = [
        { path: '/projects/tags/ci/cd', expected: getSiteUrl('/projects/tags/ci-cd') },
        { path: '/projects/tags/ci/cd/', expected: getSiteUrl('/projects/tags/ci-cd') },
        { path: '/projects/tags/ui/ux', expected: getSiteUrl('/projects/tags/ui-ux') },
        { path: '/blog/tags/ci/cd', expected: getSiteUrl('/blog/tags/ci-cd') },
        { path: '/blog/tags/ui/ux', expected: getSiteUrl('/blog/tags/ui-ux') },
        { path: '/blog/tags/ui/ux/', expected: getSiteUrl('/blog/tags/ui-ux') },
        { path: '/tags/ci/cd', expected: getSiteUrl('/tags/ci-cd') },
        { path: '/tags/ui/ux/', expected: getSiteUrl('/tags/ui-ux') }
    ];
    for (const { path, expected } of slashTagRoutes) {
        const redirectRes = proxy(new NextRequest(getSiteUrl(path)));
        assert(redirectRes.status === 308, `Route ${path} should return 308 redirect`);
        assert(
            redirectRes.headers.get('Location') === expected,
            `Route ${path} should redirect to ${expected}, got: ${redirectRes.headers.get('Location')}`
        );
    }

    // --- Unified Tag Shared Matching Integrity Checks ---
    const kotlinProjects = projects.filter((p) => p.tags?.some((t) => slugifyTag(t) === 'kotlin'));
    const kotlinPosts = articles.filter((a) => a.tags?.some((t) => slugifyTag(t) === 'kotlin'));
    assert(kotlinProjects.length > 0, "Shared tag 'kotlin' must have at least one project");
    assert(kotlinPosts.length > 0, "Shared tag 'kotlin' must have at least one article");

    const legaltechProjects = projects.filter((p) => p.tags?.some((t) => slugifyTag(t) === 'legaltech'));
    const legaltechPosts = articles.filter((a) => a.tags?.some((t) => slugifyTag(t) === 'legaltech'));
    assert(legaltechProjects.length > 0, "Project-only tag 'legaltech' must have at least one project");
    assert(legaltechPosts.length === 0, "Project-only tag 'legaltech' must not have any articles");

    const tsProjects = projects.filter((p) => p.tags?.some((t) => slugifyTag(t) === 'typescript'));
    const tsPosts = articles.filter((a) => a.tags?.some((t) => slugifyTag(t) === 'typescript'));
    assert(tsProjects.length === 0, "Blog-only tag 'typescript' must not have any projects");
    assert(tsPosts.length > 0, "Blog-only tag 'typescript' must have at least one article");

    // --- Deprecated Projects Data Validation ---
    const { getDeprecatedProjects } = await import('../src/lib/mdx');
    const deprecatedProjects = getDeprecatedProjects();
    assert(Array.isArray(deprecatedProjects), 'Deprecated projects should load as an array');
    assert(deprecatedProjects.length > 0, 'data/deprecated.json should contain at least one project');

    for (const dep of deprecatedProjects) {
        assert(
            typeof dep.title === 'string' && dep.title.trim().length > 0,
            `Deprecated project '${dep.title}' must have a valid title`
        );
        assert(
            typeof dep.description === 'string' && dep.description.trim().length > 0,
            `Deprecated project '${dep.title}' must have a valid description`
        );
        assert(dep.deprecated === true, `Deprecated project '${dep.title}' must have deprecated: true`);
        assert(
            typeof dep.deprecated_reason === 'string' && dep.deprecated_reason.trim().length > 0,
            `Deprecated project '${dep.title}' must have a valid deprecated_reason`
        );
    }

    // --- Manifest Theme & Icon Integrity Checks ---
    const { default: manifest } = await import('../src/app/manifest');
    const manifestData = manifest();
    assert(
        manifestData.background_color === '#0a0a0a',
        `Manifest background_color must be '#0a0a0a' (dark background), got: ${manifestData.background_color}`
    );
    assert(
        manifestData.theme_color === '#0a0a0a',
        `Manifest theme_color must be '#0a0a0a' (dark chrome), got: ${manifestData.theme_color}`
    );
    assert(manifestData.display === 'standalone', 'Manifest display must be standalone');
    assert(
        Array.isArray(manifestData.icons) && manifestData.icons.length >= 2,
        'Manifest must declare at least 2 icons'
    );

    // --- OpenGraph and Site URL Integrity Checks ---
    const { createOpenGraph } = await import('../src/lib/content/profile');
    const defaultOg = createOpenGraph();
    assert(defaultOg.siteName === profileData.name, `createOpenGraph must default siteName to ${profileData.name}`);
    assert(defaultOg.locale === 'en_US', "createOpenGraph must default locale to 'en_US'");
    assert((defaultOg as Record<string, unknown>).type === 'website', "createOpenGraph must default type to 'website'");

    const overriddenOg = createOpenGraph({
        title: 'Custom Title',
        type: 'article',
        publishedTime: '2026-10-17'
    });
    assert(
        overriddenOg.siteName === profileData.name,
        'createOpenGraph must preserve siteName when overrides are provided'
    );
    assert(overriddenOg.locale === 'en_US', 'createOpenGraph must preserve locale when overrides are provided');
    assert((overriddenOg as Record<string, unknown>).type === 'article', 'createOpenGraph must respect type override');
    assert(overriddenOg.title === 'Custom Title', 'createOpenGraph must respect title override');
    assert(
        (overriddenOg as Record<string, unknown>).publishedTime === '2026-10-17',
        'createOpenGraph must respect publishedTime override'
    );

    assert(getSiteUrl() === profileData.url, `getSiteUrl() must return canonical base URL ${profileData.url}`);
    assert(
        getSiteUrl('test') === `${profileData.url}/test`,
        `getSiteUrl('test') must normalize path with leading slash`
    );
    assert(
        getSiteUrl('/test') === `${profileData.url}/test`,
        `getSiteUrl('/test') must handle paths with leading slash`
    );

    const { default: sitemapFn } = await import('../src/app/sitemap');
    const sitemapEntries = sitemapFn();
    assert(Array.isArray(sitemapEntries) && sitemapEntries.length > 0, 'Sitemap must return a non-empty array');
    for (const entry of sitemapEntries) {
        assert(
            entry.url.startsWith(getSiteUrl()),
            `Sitemap entry ${entry.url} must start with canonical base URL ${getSiteUrl()}`
        );
    }

    // Verify static routes in sitemap omit lastModified
    const staticSitemapRoutes = ['', '/blog', '/projects', '/agents'].map((r) => getSiteUrl(r));
    for (const url of staticSitemapRoutes) {
        const staticEntry = sitemapEntries.find((e) => e.url === url);
        assert(!!staticEntry, `Sitemap must contain static route ${url}`);
        assert(
            staticEntry?.lastModified === undefined,
            `Static route ${url} must omit lastModified because modification is not tracked`
        );
    }

    // --- Blog OpenGraph (Social Preview) Images Integrity Checks ---
    console.log('Checking Blog OpenGraph social preview images & conversion helpers...');
    const { getBlogOgImage } = await import('../src/lib/og');
    const { convertSvgToPng } = await import('../src/lib/og-generator');
    const fsMod = await import('node:fs');
    const pathMod = await import('node:path');

    for (const article of articles) {
        const og = getBlogOgImage(article.slug, article.title);
        const svgPath = pathMod.join(process.cwd(), 'public', 'svgs', `${article.slug}.svg`);
        const pngPath = pathMod.join(process.cwd(), 'public', 'images', 'og', `${article.slug}.png`);

        assert(
            fsMod.existsSync(svgPath),
            `Article ${article.slug} must have dedicated SVG artwork in public/svgs/${article.slug}.svg`
        );
        assert(og.url.startsWith('https://'), `Article ${article.slug} OG URL must be absolute HTTPS: ${og.url}`);
        assert(og.url.endsWith('.png'), `Article ${article.slug} OG URL must target PNG format: ${og.url}`);
        assert(og.width === 2400, `Article ${article.slug} OG width must be 2400 (2x Retina), got: ${og.width}`);
        assert(og.height === 1260, `Article ${article.slug} OG height must be 1260 (2x Retina), got: ${og.height}`);
        assert(og.type === 'image/png', `Article ${article.slug} OG type must be image/png`);
        assert(fsMod.existsSync(pngPath), `Article ${article.slug} must have converted PNG in public/images/og/`);

        const pngBuffer = fsMod.readFileSync(pngPath);
        assert(pngBuffer.length > 1000, `Article ${article.slug} PNG must have non-trivial byte size`);
        // PNG magic bytes: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
        const isPng = pngBuffer[0] === 0x89 && pngBuffer[1] === 0x50 && pngBuffer[2] === 0x4e && pngBuffer[3] === 0x47;
        assert(isPng, `Article ${article.slug} file must be a valid PNG binary`);
    }

    // Test convertSvgToPng helper with in-memory SVG
    const testSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#000"/></svg>';
    const testPngBuf = await convertSvgToPng(Buffer.from(testSvg));
    assert(testPngBuf.length > 100, 'convertSvgToPng produces valid PNG buffer from in-memory SVG');
    assert(testPngBuf[0] === 0x89 && testPngBuf[1] === 0x50, 'convertSvgToPng returns valid PNG magic header');

    // Test fallback for missing/empty slug
    const fallbackOg = getBlogOgImage('', 'Fallback Post');
    assert(fallbackOg.url.endsWith('/icon-512.png'), 'Empty slug falls back to /icon-512.png');
    assert(fallbackOg.width === 512 && fallbackOg.height === 512, 'Fallback OG image uses 512x512');

    // --- Project OpenGraph Logo Images Integrity Checks ---
    console.log('Checking Project OpenGraph logo preview images...');
    const { getProjectOgImage } = await import('../src/lib/og');

    for (const project of projects) {
        const og = getProjectOgImage(project.slug, project.title);
        assert(og.url.startsWith('https://'), `Project ${project.slug} OG URL must be absolute HTTPS: ${og.url}`);
        assert(
            og.url.includes(`/project-logo/${project.slug}.`),
            `Project ${project.slug} OG URL must target logo directly as-is: ${og.url}`
        );
        assert(
            og.type === 'image/png' || og.type === 'image/jpeg' || og.type === 'image/webp',
            `Project ${project.slug} OG type must be valid image MIME: ${og.type}`
        );

        const urlObj = new URL(og.url);
        const diskPath = pathMod.join(process.cwd(), 'public', urlObj.pathname);
        assert(
            fsMod.existsSync(diskPath),
            `Project ${project.slug} logo must exist on disk at public${urlObj.pathname}`
        );

        const imgBuffer = fsMod.readFileSync(diskPath);
        assert(imgBuffer.length > 1000, `Project ${project.slug} logo must have non-trivial byte size`);
        const isPng = imgBuffer[0] === 0x89 && imgBuffer[1] === 0x50 && imgBuffer[2] === 0x4e && imgBuffer[3] === 0x47;
        const isJpg = imgBuffer[0] === 0xff && imgBuffer[1] === 0xd8;
        assert(isPng || isJpg, `Project ${project.slug} file must be a valid image binary`);
    }

    // Test fallback for missing project slug
    const fallbackProjectOg = getProjectOgImage('', 'Fallback Project');
    assert(fallbackProjectOg.url.endsWith('/icon-512.png'), 'Empty project slug falls back to /icon-512.png');

    // --- Scroll Behavior & Reduced Motion Checks ---
    console.log('Checking Scroll Behavior & Reduced Motion helpers...');
    const { getScrollBehavior, prefersReducedMotion, scrollToTop, scrollElementBy, scrollElementIntoView } =
        await import('../src/lib/scroll');

    assert(getScrollBehavior() === 'smooth', 'Default scroll behavior without reduced motion is smooth');
    assert(getScrollBehavior('auto') === 'auto', 'Explicit auto behavior is preserved');
    assert(prefersReducedMotion() === false, 'prefersReducedMotion safely defaults to false in SSR/Node');

    const originalWindow = globalThis.window;
    try {
        let reducedMotionMatches = true;
        let lastWindowScroll: ScrollToOptions | null = null;
        (globalThis as unknown as { window: unknown }).window = {
            matchMedia: (query: string) => ({
                matches: query.includes('prefers-reduced-motion: reduce') ? reducedMotionMatches : false,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false
            }),
            scrollTo: (opts: ScrollToOptions) => {
                lastWindowScroll = opts;
            }
        };

        assert(prefersReducedMotion() === true, 'prefersReducedMotion detects reduced motion media query');
        assert(
            getScrollBehavior() === 'auto',
            'getScrollBehavior switches smooth to auto when reduced motion is preferred'
        );
        assert(
            getScrollBehavior('smooth') === 'auto',
            'getScrollBehavior overrides explicit smooth with auto under reduced motion'
        );

        scrollToTop();
        assert(
            lastWindowScroll !== null &&
                (lastWindowScroll as ScrollToOptions).top === 0 &&
                (lastWindowScroll as ScrollToOptions).behavior === 'auto',
            'scrollToTop uses auto behavior under reduced motion'
        );

        let lastElementScroll: ScrollToOptions | null = null;
        const mockElement = {
            scrollBy: (opts: ScrollToOptions) => {
                lastElementScroll = opts;
            },
            scrollIntoView: (opts?: ScrollIntoViewOptions) => {
                lastElementScroll = opts as ScrollToOptions;
            }
        } as unknown as HTMLElement;

        scrollElementBy(mockElement, { top: 50, behavior: 'smooth' });
        assert(
            lastElementScroll !== null &&
                (lastElementScroll as ScrollToOptions).top === 50 &&
                (lastElementScroll as ScrollToOptions).behavior === 'auto',
            'scrollElementBy enforces auto behavior under reduced motion'
        );

        scrollElementIntoView(mockElement, { behavior: 'smooth' });
        assert(
            lastElementScroll !== null && (lastElementScroll as ScrollToOptions).behavior === 'auto',
            'scrollElementIntoView enforces auto behavior under reduced motion'
        );

        // Switch to reduced motion disabled
        reducedMotionMatches = false;
        assert(
            getScrollBehavior() === 'smooth',
            'getScrollBehavior returns smooth when reduced motion is not requested'
        );
        scrollToTop();
        assert(
            lastWindowScroll !== null && (lastWindowScroll as ScrollToOptions).behavior === 'smooth',
            'scrollToTop uses smooth behavior when reduced motion is false'
        );
    } finally {
        (globalThis as unknown as { window: unknown }).window = originalWindow;
    }

    // --- Wishlist Content, Schema & Robots Checks ---
    const { getWishlistItems } = await import('../src/lib/mdx');
    const { WishlistItemSchema } = await import('../src/lib/content/types');

    const wishlistItems = getWishlistItems();
    assert(Array.isArray(wishlistItems) && wishlistItems.length > 0, 'Wishlist must contain items');
    for (const item of wishlistItems) {
        assert(
            typeof item.link === 'string' && item.link.startsWith('https://'),
            `Wishlist item "${item.title}" must have an HTTPS link: got ${item.link}`
        );
        const parseResult = WishlistItemSchema.safeParse(item);
        assert(parseResult.success, `Wishlist item "${item.title}" must satisfy WishlistItemSchema`);
    }

    // Schema rejects non-HTTPS link
    const httpCheck = WishlistItemSchema.safeParse({
        title: 'Test Item',
        description: 'Test description',
        link: 'http://example.com',
        category: 'tech'
    });
    assert(!httpCheck.success, 'WishlistItemSchema rejects non-HTTPS URL');

    // Schema rejects invalid URL format
    const invalidUrlCheck = WishlistItemSchema.safeParse({
        title: 'Test Item',
        description: 'Test description',
        link: 'not-a-url',
        category: 'tech'
    });
    assert(!invalidUrlCheck.success, 'WishlistItemSchema rejects malformed URL string');

    // --- Contact Backend & Validation Checks ---
    const { validateContactForm, submitContactForm } = await import('../src/lib/contact');

    // 1. Missing / whitespace firstName
    const emptyFirst = validateContactForm({ firstName: '   ', email: 'test@example.org', message: 'Hi' });
    assert(!emptyFirst.valid && emptyFirst.field === 'firstName', 'validateContactForm rejects whitespace firstName');

    // 2. Overlong firstName (> 100)
    const longFirst = validateContactForm({ firstName: 'A'.repeat(101), email: 'test@example.org', message: 'Hi' });
    assert(!longFirst.valid && longFirst.field === 'firstName', 'validateContactForm rejects >100 char firstName');

    // 2b. Overlong lastName (> 100)
    const longLast = validateContactForm({
        firstName: 'Tony',
        lastName: 'A'.repeat(101),
        email: 'test@example.org',
        message: 'Hi'
    });
    assert(!longLast.valid && longLast.field === 'lastName', 'validateContactForm rejects >100 char lastName');

    // 3. Invalid email syntax
    const badEmail = validateContactForm({ firstName: 'Bruce', email: 'not-an-email', message: 'Hi' });
    assert(!badEmail.valid && badEmail.field === 'email', 'validateContactForm rejects invalid email syntax');

    // 3b. Overlong email (> 254)
    const longEmail = validateContactForm({
        firstName: 'Tony',
        email: 'a'.repeat(243) + '@example.com',
        message: 'Hi'
    });
    assert(!longEmail.valid && longEmail.field === 'email', 'validateContactForm rejects >254 char email');

    // 4. Blocked disposable domain
    const blockedDomain = validateContactForm({ firstName: 'Bruce', email: 'bruce@mailinator.com', message: 'Hi' });
    assert(
        !blockedDomain.valid && blockedDomain.field === 'email',
        'validateContactForm rejects disposable email domains'
    );

    // 4b. Overlong address (> 300)
    const longAddress = validateContactForm({
        firstName: 'Tony',
        email: 'tony@stark.com',
        address: 'A'.repeat(301),
        message: 'Hi'
    });
    assert(!longAddress.valid && longAddress.field === 'address', 'validateContactForm rejects >300 char address');

    // 5. Missing / whitespace message
    const emptyMsg = validateContactForm({ firstName: 'Bruce', email: 'bruce@wayne.com', message: '   ' });
    assert(!emptyMsg.valid && emptyMsg.field === 'message', 'validateContactForm rejects whitespace message');

    // 5b. Overlong message (> 5000)
    const longMessage = validateContactForm({
        firstName: 'Tony',
        email: 'tony@stark.com',
        message: 'A'.repeat(5001)
    });
    assert(!longMessage.valid && longMessage.field === 'message', 'validateContactForm rejects >5000 char message');

    // 6. Bot honeypot detection
    const botCheck = validateContactForm({
        'bot-field': 'spambot',
        firstName: 'Spam',
        email: 'spam@bot.com',
        message: 'Buy pills'
    });
    assert(botCheck.valid && botCheck.isBot === true, 'validateContactForm catches honeypot bot-field');

    // 7. Clean valid submission
    const validCheck = validateContactForm({
        firstName: 'Tony',
        email: 'tony@stark.com',
        message: 'Let us build something great!'
    });
    assert(validCheck.valid && validCheck.isBot === false, 'validateContactForm accepts valid form submission');
    assert(validCheck.valid && validCheck.data.firstName === 'Tony', 'validateContactForm returns trimmed valid data');
    assert(
        validCheck.valid && validCheck.data.botField === '',
        'validateContactForm initializes botField to empty string'
    );

    // 8. submitContactForm includes honeypot bot-field with empty value and correct form-name
    const originalFetch = globalThis.fetch;
    let interceptedUrl: string | URL | Request | null = null;
    let interceptedOptions: RequestInit | null = null;
    const getInterceptedOptions = (): RequestInit | null => interceptedOptions;
    const getInterceptedUrl = (): string | URL | Request | null => interceptedUrl;

    globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
        interceptedUrl = input;
        interceptedOptions = init ?? null;
        return new Response('', { status: 200, statusText: 'OK' });
    }) as typeof fetch;

    try {
        const submissionResult = await submitContactForm({
            firstName: 'Tony',
            lastName: 'Stark',
            email: 'tony@stark.com',
            address: 'Malibu, CA',
            message: 'Building a better future',
            updatesConsent: true
        });

        assert(submissionResult.success === true, 'submitContactForm returns success for 200 OK');
        assert(getInterceptedUrl() === '/netlify-form.html', 'submitContactForm targets /netlify-form.html');
        const opts = getInterceptedOptions();
        assert(opts?.method === 'POST', 'submitContactForm uses POST method');
        assert(
            Boolean(
                opts?.headers &&
                (opts.headers as Record<string, string>)['Content-Type'] === 'application/x-www-form-urlencoded'
            ),
            'submitContactForm sets application/x-www-form-urlencoded Content-Type'
        );

        const bodyString = typeof opts?.body === 'string' ? opts.body : '';
        const bodyParams = new URLSearchParams(bodyString);

        assert(bodyParams.get('form-name') === 'sign-up-form', "Payload includes 'form-name' set to 'sign-up-form'");
        assert(bodyParams.has('bot-field'), "Payload includes 'bot-field' honeypot field");
        assert(bodyParams.get('bot-field') === '', "Payload 'bot-field' has an empty value for legitimate submissions");
        assert(bodyParams.get('firstName') === 'Tony', "Payload includes correct 'firstName'");
        assert(bodyParams.get('lastName') === 'Stark', "Payload includes correct 'lastName'");
        assert(bodyParams.get('email') === 'tony@stark.com', "Payload includes correct 'email'");
        assert(bodyParams.get('address') === 'Malibu, CA', "Payload includes correct 'address'");
        assert(bodyParams.get('message') === 'Building a better future', "Payload includes correct 'message'");
        assert(bodyParams.get('updatesConsent') === 'on', "Payload includes correct 'updatesConsent'");

        // Also test submission directly using validated data from validateContactForm
        if (validCheck.valid) {
            interceptedUrl = null;
            interceptedOptions = null;
            const validSubmissionResult = await submitContactForm(validCheck.data);
            assert(validSubmissionResult.success === true, 'submitContactForm succeeds with validateContactForm data');
            const validOpts = getInterceptedOptions();
            const validBodyParams = new URLSearchParams(typeof validOpts?.body === 'string' ? validOpts.body : '');
            assert(validBodyParams.get('form-name') === 'sign-up-form', "Validated payload includes 'form-name'");
            assert(validBodyParams.has('bot-field'), "Validated payload includes 'bot-field'");
            assert(validBodyParams.get('bot-field') === '', "Validated payload 'bot-field' is empty string");
        }
    } finally {
        globalThis.fetch = originalFetch;
    }

    console.log('Checking Web App Manifest configuration & iOS assets...');
    const appManifest = manifest();
    assert(Boolean(appManifest.id), 'Manifest defines an id');
    assert(appManifest.scope === '/', "Manifest scope is set to '/'");
    assert(appManifest.start_url === '/?source=pwa', "Manifest start_url includes '?source=pwa'");
    assert(appManifest.orientation === 'portrait-primary', "Manifest orientation is 'portrait-primary'");
    assert(appManifest.lang === 'en-US', "Manifest lang is 'en-US'");
    assert(appManifest.dir === 'ltr', "Manifest dir is 'ltr'");
    assert(
        Array.isArray(appManifest.categories) && appManifest.categories.includes('portfolio'),
        "Manifest categories include 'portfolio'"
    );
    assert(
        Array.isArray(appManifest.categories) && appManifest.categories.includes('technology'),
        "Manifest categories include 'technology'"
    );

    // Check icons
    assert(Array.isArray(appManifest.icons) && appManifest.icons.length >= 4, 'Manifest defines icons');
    const hasAppleIcon = appManifest.icons?.some((i) => i.src.includes('apple-touch-icon') && i.sizes === '180x180');
    assert(Boolean(hasAppleIcon), 'Manifest includes 180x180 Apple touch icon for iPhone');
    const hasMaskable = appManifest.icons?.some((i) => i.purpose === 'maskable');
    assert(Boolean(hasMaskable), 'Manifest includes maskable icon for PWA compliance');

    // Verify all icon files exist in public/
    appManifest.icons?.forEach((icon) => {
        const filePath = path.join(process.cwd(), 'public', icon.src.replace(/^\//, ''));
        assert(fs.existsSync(filePath), `Icon file exists on disk: ${icon.src}`);
    });

    // Check screenshots
    assert(
        Array.isArray(appManifest.screenshots) && appManifest.screenshots.length >= 2,
        'Manifest defines screenshots'
    );
    const hasIphoneScreenshot = appManifest.screenshots?.some(
        (s) => s.platform === 'ios' && s.form_factor === 'narrow'
    );
    assert(Boolean(hasIphoneScreenshot), 'Manifest includes iOS narrow screenshot for iPhone');
    appManifest.screenshots?.forEach((screenshot) => {
        const filePath = path.join(process.cwd(), 'public', screenshot.src.replace(/^\//, ''));
        assert(fs.existsSync(filePath), `Screenshot file exists on disk: ${screenshot.src}`);
    });

    // Check shortcuts
    assert(Array.isArray(appManifest.shortcuts) && appManifest.shortcuts.length >= 3, 'Manifest defines shortcuts');

    console.log(`\n=== Test Results ===`);
    console.log(`Assertions Passed: ${passed}`);
    if (failed > 0) {
        console.log(`Assertions Failed: ${failed}`);
        process.exit(1);
    } else {
        console.log('All content integrity checks passed successfully! 🎉');
        process.exit(0);
    }
}

runIntegrityChecks();
