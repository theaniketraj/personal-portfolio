import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import {
    ProjectSchema,
    ProjectMeta,
    ProjectData,
    BlogPostSchema,
    BlogPostMeta,
    BlogPostData,
    DeprecatedProject,
    DeprecatedProjectSchema,
    WishlistItem,
    WishlistItemSchema
} from './content/types';

const PROJECTS_DIR = path.join(process.cwd(), 'projects');
const BLOG_DIR = path.join(process.cwd(), 'blog');
const DEPRECATED_PATH = path.join(process.cwd(), 'data', 'deprecated.json');
const WISHLIST_PATH = path.join(process.cwd(), 'data', 'wishlist.json');

function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function formatRequiredDate(date: Date | string | undefined): string {
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    return date || '';
}

function formatOptionalDate(date: Date | string | undefined): string | undefined {
    if (!date) {
        return undefined;
    }
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    return date;
}

// Get all projects
export function getProjects(): ProjectMeta[] {
    if (!fs.existsSync(PROJECTS_DIR)) return [];
    const files = fs.readdirSync(PROJECTS_DIR);

    const projects = files
        .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
        .map((file) => {
            const slug = file.replace(/\.mdx?$/, '');
            const fullPath = path.join(PROJECTS_DIR, file);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            // Validate with Zod
            const parsedData = ProjectSchema.parse(data);

            return {
                slug,
                title: parsedData.title || slug,
                date: formatRequiredDate(parsedData.date),
                updatedAt: formatOptionalDate(parsedData.updatedAt),
                client: parsedData.client || 'Aniket Raj',
                description: parsedData.description || '',
                metaTitle: parsedData.metaTitle,
                metaDescription: parsedData.metaDescription,
                id: parsedData.id,
                tags: parsedData.tags || [],
                featured: parsedData.featured || false,
                featuredOrder: parsedData.featuredOrder || 0,
                roles: parsedData.roles || [],
                image: parsedData.image,
                domains: parsedData.domains,
                technologies: parsedData.technologies,
                engineeringAreas: parsedData.engineeringAreas,
                capabilities: parsedData.capabilities,
                status: parsedData.status,
                relatedProjects: parsedData.relatedProjects || [],
                relatedArticles: parsedData.relatedArticles || [],
                schemaType: parsedData.schemaType,
                programmingLanguage: parsedData.programmingLanguage,
                runtimePlatform: parsedData.runtimePlatform,
                applicationCategory: parsedData.applicationCategory,
                operatingSystem: parsedData.operatingSystem,
                genre: parsedData.genre,
                about: parsedData.about,
                readingTime: calculateReadingTime(content)
            } as ProjectMeta;
        });

    return projects.sort((a, b) => {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (diff !== 0) return diff;
        return a.slug.localeCompare(b.slug);
    });
}

export function getFeaturedProjects(): ProjectMeta[] {
    return getProjects()
        .filter((project) => project.featured)
        .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
}

function resolveContentFilePath(directory: string, slug: string): string | null {
    const mdxPath = path.join(directory, `${slug}.mdx`);
    if (fs.existsSync(mdxPath)) {
        return mdxPath;
    }

    const mdPath = path.join(directory, `${slug}.md`);
    if (fs.existsSync(mdPath)) {
        return mdPath;
    }

    return null;
}

// Get single project by slug
export function getProjectBySlug(slug: string): ProjectData | null {
    const filePath = resolveContentFilePath(PROJECTS_DIR, slug);
    if (!filePath) return null;

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const parsedData = ProjectSchema.parse(data);

    return {
        meta: {
            slug,
            title: parsedData.title || slug,
            date: formatRequiredDate(parsedData.date),
            updatedAt: formatOptionalDate(parsedData.updatedAt),
            client: parsedData.client || 'Aniket Raj',
            description: parsedData.description || '',
            metaTitle: parsedData.metaTitle,
            metaDescription: parsedData.metaDescription,
            id: parsedData.id,
            tags: parsedData.tags || [],
            featured: parsedData.featured || false,
            featuredOrder: parsedData.featuredOrder || 0,
            roles: parsedData.roles || [],
            image: parsedData.image,
            domains: parsedData.domains,
            technologies: parsedData.technologies,
            engineeringAreas: parsedData.engineeringAreas,
            capabilities: parsedData.capabilities,
            status: parsedData.status,
            relatedProjects: parsedData.relatedProjects || [],
            relatedArticles: parsedData.relatedArticles || [],
            schemaType: parsedData.schemaType,
            programmingLanguage: parsedData.programmingLanguage,
            runtimePlatform: parsedData.runtimePlatform,
            applicationCategory: parsedData.applicationCategory,
            operatingSystem: parsedData.operatingSystem,
            genre: parsedData.genre,
            about: parsedData.about,
            readingTime: calculateReadingTime(content)
        },
        content
    };
}

// Get all blog posts
export function getBlogPosts(): BlogPostMeta[] {
    if (!fs.existsSync(BLOG_DIR)) return [];
    const files = fs.readdirSync(BLOG_DIR);

    const posts = files
        .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
        .map((file) => {
            const slug = file.replace(/\.mdx?$/, '');
            const fullPath = path.join(BLOG_DIR, file);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            const parsedData = BlogPostSchema.parse(data);

            return {
                slug,
                title: parsedData.title || slug,
                date: formatRequiredDate(parsedData.date),
                updatedAt: formatOptionalDate(parsedData.updatedAt),
                excerpt: parsedData.excerpt || '',
                author: parsedData.author || 'Aniket Raj',
                metaTitle: parsedData.metaTitle,
                metaDescription: parsedData.metaDescription,
                id: parsedData.id,
                tags: parsedData.tags || [],
                topics: parsedData.topics,
                contentType: parsedData.contentType,
                relatedProjects: parsedData.relatedProjects || [],
                relatedArticles: parsedData.relatedArticles || [],
                readingTime: calculateReadingTime(content)
            } as BlogPostMeta;
        });

    return posts.sort((a, b) => {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (diff !== 0) return diff;
        return a.slug.localeCompare(b.slug);
    });
}

// Get single blog post by slug
export function getBlogPostBySlug(slug: string): BlogPostData | null {
    const filePath = resolveContentFilePath(BLOG_DIR, slug);
    if (!filePath) return null;

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const parsedData = BlogPostSchema.parse(data);

    return {
        meta: {
            slug,
            title: parsedData.title || slug,
            date: formatRequiredDate(parsedData.date),
            updatedAt: formatOptionalDate(parsedData.updatedAt),
            excerpt: parsedData.excerpt || '',
            author: parsedData.author || 'Aniket Raj',
            metaTitle: parsedData.metaTitle,
            metaDescription: parsedData.metaDescription,
            id: parsedData.id,
            tags: parsedData.tags || [],
            topics: parsedData.topics,
            contentType: parsedData.contentType,
            relatedProjects: parsedData.relatedProjects || [],
            relatedArticles: parsedData.relatedArticles || [],
            readingTime: calculateReadingTime(content)
        },
        content
    };
}

// Get all deprecated projects
export function getDeprecatedProjects(): DeprecatedProject[] {
    if (!fs.existsSync(DEPRECATED_PATH)) return [];
    const fileContents = fs.readFileSync(DEPRECATED_PATH, 'utf8');
    const parsedData = JSON.parse(fileContents);
    return z.array(DeprecatedProjectSchema).parse(parsedData);
}

// Get all wishlist items
export function getWishlistItems(): WishlistItem[] {
    if (!fs.existsSync(WISHLIST_PATH)) return [];
    const fileContents = fs.readFileSync(WISHLIST_PATH, 'utf8');
    const parsedData = JSON.parse(fileContents);
    return z.array(WishlistItemSchema).parse(parsedData);
}

export { slugifyTag } from './utils';
