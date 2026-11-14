import { MetadataRoute } from 'next';
import { getBlogPosts, getProjects } from '@/lib/mdx';
import { getSiteUrl } from '@/lib/content/profile';

export default function sitemap(): MetadataRoute.Sitemap {
    // Static routes: modification dates are not tracked, omit lastModified entirely
    const routes: MetadataRoute.Sitemap = ['', '/blog', '/projects', '/agents'].map((route) => ({
        url: getSiteUrl(route)
    }));

    // Dynamic Project routes: only emit lastModified when an accurate updatedAt exists
    const projects: MetadataRoute.Sitemap = getProjects().map((project) => ({
        url: getSiteUrl(`/projects/${project.slug}`),
        lastModified: project.updatedAt ? new Date(project.updatedAt) : undefined
    }));

    // Dynamic Blog routes: only emit lastModified when an accurate updatedAt exists
    const blogs: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
        url: getSiteUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined
    }));

    return [...routes, ...projects, ...blogs];
}
