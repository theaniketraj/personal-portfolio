#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * Generates sitemap.xml for all pages after Next.js build
 */

const fs = require('node:fs');
const path = require('node:path');

// Import content loading functions
const { execSync } = require('node:child_process');

try {
    // Generate sitemap using a temporary Node script
    const generateSitemapScript = `
        const { allContent, allPages } = require('./src/utils/content.ts');
        
        const baseUrl = 'https://theaniketraj.netlify.app';
        const allData = allContent();
        const pages = allPages(allData);

        // Generate sitemap entries for all pages
        const sitemapEntries = pages
            .map((page) => {
                const urlPath = page.__metadata?.urlPath || '/';
                return {
                    url: \`\${baseUrl}\${urlPath}\`,
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: urlPath === '/' ? 'weekly' : 'monthly',
                    priority: urlPath === '/' ? '1.0' : '0.8'
                };
            })
            .filter((entry) => entry.url);

        // Create XML sitemap
        const xml = \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
\${sitemapEntries.map((entry) => \`  <url>
    <loc>\${entry.url}</loc>
    <lastmod>\${entry.lastmod}</lastmod>
    <changefreq>\${entry.changefreq}</changefreq>
    <priority>\${entry.priority}</priority>
  </url>\`).join('\\n')}
</urlset>\`;

        console.log(xml);
    `;

    // Write and execute the script
    const scriptPath = path.join(process.cwd(), '.sitemap-gen.js');
    fs.writeFileSync(scriptPath, generateSitemapScript);

    // Try to generate using tsx/ts-node
    let sitemapContent = '';
    try {
        sitemapContent = execSync(`npx tsx ${scriptPath}`, { encoding: 'utf8', stdio: 'pipe' });
    } catch (e) {
        // Fallback: Generate a basic sitemap with known pages
        console.warn('Could not execute TypeScript script, generating basic sitemap...');
        const baseUrl = 'https://theaniketraj.netlify.app';
        const pages = [
            { url: '/', changefreq: 'weekly', priority: '1.0' },
            { url: '/blog', changefreq: 'monthly', priority: '0.8' },
            { url: '/projects', changefreq: 'monthly', priority: '0.8' },
            { url: '/info', changefreq: 'yearly', priority: '0.5' },
            { url: '/thank-you', changefreq: 'never', priority: '0.3' }
        ];

        const lastmod = new Date().toISOString().split('T')[0];

        sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
    .map(
        (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;
    }

    // Write sitemap to public folder
    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, sitemapContent, 'utf8');

    console.log(`✅ Sitemap generated: ${outputPath}`);
    console.log(`📦 Sitemap size: ${(sitemapContent.length / 1024).toFixed(2)} KB`);

    // Clean up temporary script
    fs.unlinkSync(scriptPath);
} catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
}
