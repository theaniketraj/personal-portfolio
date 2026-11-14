import { z } from 'zod';

export const ProjectSchema = z
    .object({
        title: z.string().min(1),
        date: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'), z.date()]),
        updatedAt: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'), z.date()]).optional(),
        client: z.string().optional(),
        description: z.string().min(1),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        id: z.string().optional(),
        tags: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
        featuredOrder: z.number().int().positive().optional(),
        roles: z.array(z.string()).optional(),
        image: z.string().optional(),
        // WebMCP Semantic Taxonomy
        domains: z.array(z.string()).min(1),
        technologies: z.array(z.string()).min(1),
        engineeringAreas: z.array(z.string()).min(1),
        capabilities: z.array(z.string()).min(1),
        status: z.enum(['active', 'completed', 'archived']),
        // Relationships
        relatedProjects: z.array(z.string()).optional(),
        relatedArticles: z.array(z.string()).optional(),
        // Structured Data (JSON-LD)
        schemaType: z.enum(['SoftwareApplication', 'SoftwareSourceCode', 'CreativeWork']).optional(),
        programmingLanguage: z.string().optional(),
        runtimePlatform: z.string().optional(),
        applicationCategory: z.string().optional(),
        operatingSystem: z.string().optional(),
        genre: z.string().optional(),
        about: z.string().optional()
    })
    .refine((data) => !data.featuredOrder || data.featured, {
        message: 'featuredOrder should only be set if featured is true',
        path: ['featuredOrder']
    });

export type ProjectMeta = Omit<z.infer<typeof ProjectSchema>, 'date' | 'updatedAt' | 'title'> & {
    id?: string;
    slug: string;
    title: string;
    date: string;
    updatedAt?: string;
    readingTime?: number;
};

export interface ProjectData {
    meta: ProjectMeta;
    content: string;
}

export const BlogPostSchema = z.object({
    title: z.string().min(1),
    date: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'), z.date()]),
    updatedAt: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'), z.date()]).optional(),
    excerpt: z.string().min(1),
    author: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    id: z.string().optional(),
    tags: z.array(z.string()).min(1),
    // WebMCP Semantic Taxonomy
    topics: z.array(z.string()).min(1),
    contentType: z.array(z.string()).min(1),
    // Relationships
    relatedProjects: z.array(z.string()).optional(),
    relatedArticles: z.array(z.string()).optional()
});

export type BlogPostMeta = Omit<z.infer<typeof BlogPostSchema>, 'date' | 'updatedAt' | 'title'> & {
    id?: string;
    slug: string;
    title: string;
    date: string;
    updatedAt?: string;
    readingTime?: number;
};

export interface BlogPostData {
    meta: BlogPostMeta;
    content: string;
}

export interface Experience {
    icon: string;
    role: string;
    location: string;
    startYear: string;
    endYear: string;
    bulletPoints: string[];
}

export interface Education {
    date: string;
    title: string;
    subtitle: string;
}

export const DeprecatedProjectSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    link: z.string(),
    deprecated: z.boolean(),
    deprecated_reason: z.string()
});

export type DeprecatedProject = z.infer<typeof DeprecatedProjectSchema>;

export const WishlistItemSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    link: z
        .string()
        .url('Wishlist item link must be a valid URL')
        .refine((url) => url.startsWith('https://'), {
            message: 'Wishlist item link must be an HTTPS URL'
        }),
    category: z.string().min(1)
});

export type WishlistItem = z.infer<typeof WishlistItemSchema>;
