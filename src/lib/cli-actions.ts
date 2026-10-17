'use server';

import { getProjects, getBlogPosts } from './mdx';

export async function fetchProjectsForCli() {
    await Promise.resolve();
    const projects = getProjects();
    return projects.slice(0, 3).map((p) => ({
        title: p.title,
        description: p.description,
        slug: p.slug
    }));
}

export async function fetchBlogsForCli() {
    await Promise.resolve();
    const blogs = getBlogPosts();
    return blogs.slice(0, 3).map((b) => ({
        title: b.title,
        description: b.excerpt || b.metaDescription || '',
        slug: b.slug
    }));
}
