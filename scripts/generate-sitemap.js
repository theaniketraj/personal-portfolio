#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * Generates sitemap.xml for all pages dynamically
 */

const fs = require('node:fs');
const path = require('node:path');

const baseUrl = 'https://theaniketraj.netlify.app';
const pagesDir = path.join(process.cwd(), 'content', 'pages');

function getFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            if (name.endsWith('.md') || name.endsWith('.json')) {
                files.push(name);
            }
        }
    }
    return files;
}

try {
    const allFiles = getFiles(pagesDir);
    const pages = allFiles.map((file) => {
        // Convert backslashes to forward slashes
        let relativePath = path.relative(pagesDir, file).replaceAll('\\', '/');
        
        // Remove extension
        relativePath = relativePath.substring(0, relativePath.lastIndexOf('.'));
        
        // Handle index files
        if (relativePath.endsWith('/index')) {
            relativePath = relativePath.slice(0, -6);
        } else if (relativePath === 'index') {
            relativePath = '';
        }
        
        const urlPath = `/${relativePath}`;
        return {
            url: `${baseUrl}${urlPath}`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: urlPath === '/' ? 'weekly' : 'monthly',
            priority: urlPath === '/' ? '1.0' : '0.8'
        };
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
    .map(
        (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, sitemapContent, 'utf8');

    console.log(`✅ Sitemap generated: ${outputPath}`);
    console.log(`📦 Sitemap size: ${(sitemapContent.length / 1024).toFixed(2)} KB`);
    console.log(`📄 Pages included: ${pages.length}`);

} catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
}
