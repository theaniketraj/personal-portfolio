import { MetadataRoute } from 'next';
import { getBlogPosts, getProjects } from '@/lib/mdx';
import { getSiteUrl } from '@/lib/content/profile';

export default function sitemap(): MetadataRoute.Sitemap {
    // Static routes
    const routes = ['', '/blog', '/projects', '/agents'].map((route) => ({
        url: getSiteUrl(route),
        lastModified: new Date()
    }));

    // Dynamic Project routes
    const projects = getProjects().map((project) => ({
        url: getSiteUrl(`/projects/${project.slug}`),
        lastModified: project.date ? new Date(project.date) : new Date()
    }));

    // Dynamic Blog routes
    const blogs = getBlogPosts().map((post) => ({
        url: getSiteUrl(`/blog/${post.slug}`),
        lastModified: post.date ? new Date(post.date) : new Date()
    }));

    return [...routes, ...projects, ...blogs];
}
