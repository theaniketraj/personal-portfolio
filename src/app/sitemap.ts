import { MetadataRoute } from 'next';
import { getBlogPosts, getProjects } from '@/lib/mdx';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://theaniketraj.netlify.app';

    // Static routes
    const routes = ['', '/blog', '/projects', '/agents'].map((route) => ({
        url: `${baseUrl}${route}`
    }));

    // Dynamic Project routes
    const projects = getProjects().map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`
    }));

    // Dynamic Blog routes
    const blogs = getBlogPosts().map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`
    }));

    return [...routes, ...projects, ...blogs];
}
