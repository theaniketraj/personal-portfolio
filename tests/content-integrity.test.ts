import { getProjects, getBlogPosts, slugifyTag } from '../src/lib/mdx';

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
    const { getProjectBySlug, getBlogPostBySlug } = await import('../src/lib/mdx');

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
            // Check if Go-To heading exists and preserves 'go-to' id with 'Project Resources' text
            if (/^(#{2,3})\s+.*go-to.*$/im.test(fullProject.content)) {
                const goToHeading = headings.find((h) => h.text === 'Project Resources');
                assert(
                    !!goToHeading,
                    `Project ${project.slug} with Go-To section must have 'Project Resources' in TOC headings`
                );
                assert(
                    goToHeading?.id === 'go-to',
                    `Project ${project.slug} Go-To heading must preserve source ID 'go-to', but got '${goToHeading?.id}'`
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
        { path: '/blog/tags/ui/ux/', expected: getSiteUrl('/blog/tags/ui-ux') }
    ];
    for (const { path, expected } of slashTagRoutes) {
        const redirectRes = proxy(new NextRequest(getSiteUrl(path)));
        assert(redirectRes.status === 308, `Route ${path} should return 308 redirect`);
        assert(
            redirectRes.headers.get('Location') === expected,
            `Route ${path} should redirect to ${expected}, got: ${redirectRes.headers.get('Location')}`
        );
    }

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

    // --- Contact Backend & Validation Checks ---
    const { validateContactForm } = await import('../src/lib/contact');

    // 1. Missing / whitespace firstName
    const emptyFirst = validateContactForm({ firstName: '   ', email: 'test@example.org', message: 'Hi' });
    assert(!emptyFirst.valid && emptyFirst.field === 'firstName', 'validateContactForm rejects whitespace firstName');

    // 2. Overlong firstName (> 100)
    const longFirst = validateContactForm({ firstName: 'A'.repeat(101), email: 'test@example.org', message: 'Hi' });
    assert(!longFirst.valid && longFirst.field === 'firstName', 'validateContactForm rejects >100 char firstName');

    // 3. Invalid email syntax
    const badEmail = validateContactForm({ firstName: 'Bruce', email: 'not-an-email', message: 'Hi' });
    assert(!badEmail.valid && badEmail.field === 'email', 'validateContactForm rejects invalid email syntax');

    // 4. Blocked disposable domain
    const blockedDomain = validateContactForm({ firstName: 'Bruce', email: 'bruce@mailinator.com', message: 'Hi' });
    assert(
        !blockedDomain.valid && blockedDomain.field === 'email',
        'validateContactForm rejects disposable email domains'
    );

    // 5. Missing / whitespace message
    const emptyMsg = validateContactForm({ firstName: 'Bruce', email: 'bruce@wayne.com', message: '   ' });
    assert(!emptyMsg.valid && emptyMsg.field === 'message', 'validateContactForm rejects whitespace message');

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
