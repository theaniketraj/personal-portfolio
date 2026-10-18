import { NextResponse } from 'next/server';
import { getProjects, getProjectBySlug, getBlogPosts, getBlogPostBySlug } from '@/lib/mdx';
import { profileData, getSiteUrl } from '@/lib/content/profile';
import { registry } from '@/lib/webmcp/registry';
import '@/lib/webmcp/actions';

export async function GET() {
    await Promise.resolve();
    const projects = getProjects();
    const blogs = getBlogPosts();
    const baseUrl = getSiteUrl();

    let content = `# ${profileData.name} — Full Knowledge Base & Technical Content (llms-full.txt)\n\n`;
    content += `> **Author:** ${profileData.name} (${profileData.title})\n`;
    content += `> **Website:** [${baseUrl}](${baseUrl})\n`;
    content += `> **Role:** ${profileData.role}\n`;
    content += `> **Focus Areas:** ${profileData.focus.join(', ')}\n`;
    content += `> **Description:** ${profileData.description}\n\n`;
    content += `This document provides the complete, uncompressed raw text of all software projects, case studies, and engineering deep-dive articles published on ${profileData.name}'s portfolio for single-context AI model ingestion.\n\n`;
    content += `---\n\n`;

    // 1. Projects Section
    content += `## SECTION 1: TECHNICAL PROJECTS & SYSTEMS\n\n`;
    for (const p of projects) {
        const fullProject = getProjectBySlug(p.slug);
        content += `### Project: ${p.title}\n`;
        content += `- **URL:** ${baseUrl}/projects/${p.slug}\n`;
        content += `- **Date:** ${p.date}\n`;
        content += `- **Domains:** ${(p.domains || []).join(', ')}\n`;
        content += `- **Technologies:** ${(p.technologies || []).join(', ')}\n`;
        content += `- **Engineering Areas:** ${(p.engineeringAreas || []).join(', ')}\n`;
        content += `- **Description:** ${p.description}\n\n`;
        if (fullProject?.content) {
            content += `${fullProject.content.trim()}\n\n`;
        }
        content += `---\n\n`;
    }

    // 2. Blog Posts Section
    content += `## SECTION 2: TECHNICAL DEEP DIVES & ARTICLES\n\n`;
    for (const b of blogs) {
        const fullBlog = getBlogPostBySlug(b.slug);
        content += `### Article: ${b.title}\n`;
        content += `- **URL:** ${baseUrl}/blog/${b.slug}\n`;
        content += `- **Date:** ${b.date}\n`;
        content += `- **Reading Time:** ${b.readingTime} min\n`;
        content += `- **Tags:** ${(b.tags || []).join(', ')}\n`;
        content += `- **Summary:** ${b.excerpt}\n\n`;
        if (fullBlog?.content) {
            content += `${fullBlog.content.trim()}\n\n`;
        }
        content += `---\n\n`;
    }

    // 3. WebMCP Tools Section
    content += `## SECTION 3: WEBMCP AGENT TOOLS & INTERFACES\n\n`;
    content += `This portfolio implements WebMCP, exposing typed capabilities to agents via \`document.modelContext\`.\n\n`;
    const tools = registry.getAllTools();
    for (const tool of tools) {
        content += `#### Tool: \`${tool.name}\` (${tool.kind})\n`;
        content += `- **Description:** ${tool.description}\n`;
        content += `- **Read-only:** ${tool.kind === 'query' ? 'Yes' : 'No (user-confirmed)'}\n\n`;
    }

    // 4. Links Section
    content += `## SECTION 4: PROFESSIONAL PROFILES & CONTACT\n\n`;
    content += `- **GitHub:** ${profileData.links.github}\n`;
    content += `- **LinkedIn:** ${profileData.links.linkedin}\n`;
    if (profileData.links.twitter) {
        content += `- **X/Twitter:** ${profileData.links.twitter}\n`;
    }
    content += `- **Resume:** ${profileData.resumeUrl}\n`;

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
        }
    });
}
