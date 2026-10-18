import { z } from 'zod';

export const SearchProjectsSchema = z
    .object({
        query: z.string().trim().max(100).optional().describe('Free-form text query for search'),
        domain: z.string().trim().max(50).optional().describe('Filter by domain (e.g. Systems, AI, Web)'),
        technology: z
            .string()
            .trim()
            .max(50)
            .optional()
            .describe('Filter by technology (e.g. Rust, TypeScript, Python)'),
        capability: z
            .string()
            .trim()
            .max(50)
            .optional()
            .describe('Filter by capability (e.g. Crash Detection, Secrets Detection)'),
        status: z.enum(['active', 'completed', 'archived']).optional().describe('Filter by project status'),
        featuredOnly: z.boolean().optional().describe('Only return featured projects'),
        limit: z.number().int().min(1).max(10).default(5).describe('Max results to return'),
        sort: z.enum(['relevance', 'date', 'featured']).default('relevance').describe('Sort order for results')
    })
    .strict();

export const SearchArticlesSchema = z
    .object({
        query: z.string().trim().max(100).optional().describe('Free-form text query for search'),
        topic: z.string().trim().max(50).optional().describe("Topic to filter by (e.g. 'Typescript', 'React')"),
        tags: z.string().trim().max(50).optional().describe('Tag to filter by'),
        contentType: z
            .string()
            .trim()
            .max(50)
            .optional()
            .describe("Content type to filter by (e.g., 'tutorial', 'essay')"),
        limit: z.number().int().min(1).max(10).default(5).describe('Max results to return'),
        sort: z.enum(['relevance', 'date']).default('relevance').describe('Sort order for results')
    })
    .strict();

export const FindRelevantWorkSchema = z
    .object({
        role: z.string().trim().max(100).optional().describe("Target role (e.g., 'Backend Engineer')"),
        skills: z
            .array(z.string().trim().min(1).max(50))
            .max(10)
            .optional()
            .describe("Relevant skills (e.g., ['Go', 'Docker'])"),
        domains: z
            .array(z.string().trim().min(1).max(50))
            .max(10)
            .optional()
            .describe("Relevant domains (e.g., ['Distributed Systems'])"),
        keywords: z.array(z.string().trim().min(1).max(50)).max(10).optional().describe('General keywords'),
        includeArchived: z.boolean().default(false).describe('Include archived projects in the search'),
        limit: z.number().int().min(1).max(10).default(3).describe('Max results to return')
    })
    .strict();

export const DraftContactSchema = z
    .object({
        firstName: z.string().trim().min(1, 'First name is required').max(100).describe("User's first name"),
        lastName: z.string().trim().max(100).optional().describe("User's last name"),
        email: z
            .string()
            .trim()
            .min(1, 'Email is required')
            .max(150)
            .email('Invalid email address')
            .describe("User's email address"),
        message: z
            .string()
            .trim()
            .min(1, 'Message is required')
            .max(2000)
            .describe('The message or project inquiry from the user')
    })
    .strict();

export const GetProjectSchema = z
    .object({
        slug: z
            .string()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
            .describe('The slug of the project (e.g. lexum, raptor)')
    })
    .strict();

export const GetArticleSchema = z
    .object({
        slug: z
            .string()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
            .describe('The slug of the article (e.g. tech-stack-wars)')
    })
    .strict();

export const EmptySchema = z.object({}).strict();

function toPlainJSONSchema(schema: z.ZodType): object {
    return structuredClone(z.toJSONSchema(schema));
}

export const SearchProjectsJSONSchema = toPlainJSONSchema(SearchProjectsSchema);
export const SearchArticlesJSONSchema = toPlainJSONSchema(SearchArticlesSchema);
export const FindRelevantWorkJSONSchema = toPlainJSONSchema(FindRelevantWorkSchema);
export const DraftContactJSONSchema = toPlainJSONSchema(DraftContactSchema);
export const GetProjectJSONSchema = toPlainJSONSchema(GetProjectSchema);
export const GetArticleJSONSchema = toPlainJSONSchema(GetArticleSchema);
export const EmptyJSONSchema = toPlainJSONSchema(EmptySchema);

// --- OUTPUT SCHEMAS ---

export const ProfileOutputSchema = z
    .object({
        name: z.string(),
        role: z.string(),
        title: z.string(),
        description: z.string(),
        focus: z.array(z.string()),
        location: z.string(),
        resumeUrl: z.string(),
        url: z.string(),
        links: z.object({
            github: z.string(),
            linkedin: z.string(),
            twitter: z.string().optional()
        }),
        experienceCount: z.number(),
        projectCount: z.number(),
        articleCount: z.number()
    })
    .strict();

export const ProjectSummaryOutputSchema = z
    .object({
        slug: z.string(),
        title: z.string(),
        description: z.string(),
        date: z.string(),
        status: z.string(),
        domains: z.array(z.string()).optional(),
        technologies: z.array(z.string()).optional(),
        engineeringAreas: z.array(z.string()).optional(),
        capabilities: z.array(z.string()).optional(),
        featured: z.boolean().optional()
    })
    .strict();

export const SearchProjectsOutputSchema = z.array(ProjectSummaryOutputSchema);

export const RelatedProjectSchema = z
    .object({
        slug: z.string(),
        title: z.string(),
        description: z.string()
    })
    .strict();

export const RelatedArticleSchema = z
    .object({
        slug: z.string(),
        title: z.string(),
        excerpt: z.string()
    })
    .strict();

export const GetProjectOutputSchema = z.union([
    z.object({ error: z.string() }),
    ProjectSummaryOutputSchema.extend({
        relatedProjectsDetails: z.array(RelatedProjectSchema),
        relatedArticlesDetails: z.array(RelatedArticleSchema)
    })
]);

export const ProjectContentMetaOutputSchema = z
    .object({
        slug: z.string(),
        title: z.string(),
        description: z.string(),
        date: z.string(),
        status: z.string(),
        client: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        id: z.string().optional(),
        tags: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
        featuredOrder: z.number().optional(),
        roles: z.array(z.string()).optional(),
        image: z.string().optional(),
        domains: z.array(z.string()).optional(),
        technologies: z.array(z.string()).optional(),
        engineeringAreas: z.array(z.string()).optional(),
        capabilities: z.array(z.string()).optional(),
        relatedProjects: z.array(z.string()).optional(),
        relatedArticles: z.array(z.string()).optional(),
        readingTime: z.number().optional()
    })
    .strict();

export const GetProjectContentOutputSchema = z.union([
    z.object({ error: z.string() }).strict(),
    z
        .object({
            meta: ProjectContentMetaOutputSchema,
            content: z.string()
        })
        .strict()
]);

export const ArticleSummaryOutputSchema = z
    .object({
        slug: z.string(),
        title: z.string(),
        excerpt: z.string(),
        date: z.string(),
        topics: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        contentType: z.array(z.string()).optional()
    })
    .strict();

export const SearchArticlesOutputSchema = z.array(ArticleSummaryOutputSchema);

export const GetArticleOutputSchema = z.union([
    z.object({ error: z.string() }),
    ArticleSummaryOutputSchema.extend({
        relatedProjectsDetails: z.array(RelatedProjectSchema),
        relatedArticlesDetails: z.array(RelatedArticleSchema)
    })
]);

export const ArticleContentMetaOutputSchema = z
    .object({
        slug: z.string(),
        title: z.string(),
        excerpt: z.string(),
        date: z.string(),
        author: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        id: z.string().optional(),
        tags: z.array(z.string()).optional(),
        topics: z.array(z.string()).optional(),
        contentType: z.array(z.string()).optional(),
        relatedProjects: z.array(z.string()).optional(),
        relatedArticles: z.array(z.string()).optional(),
        readingTime: z.number().optional()
    })
    .strict();

export const GetArticleContentOutputSchema = z.union([
    z.object({ error: z.string() }).strict(),
    z
        .object({
            meta: ArticleContentMetaOutputSchema,
            content: z.string()
        })
        .strict()
]);

export const FindRelevantWorkOutputSchema = z.object({
    projects: z.array(
        z.object({
            project: ProjectSummaryOutputSchema,
            score: z.number(),
            matches: z.array(z.string()),
            reason: z.string()
        })
    ),
    articles: z.array(
        z.object({
            article: ArticleSummaryOutputSchema,
            score: z.number(),
            matches: z.array(z.string()),
            reason: z.string()
        })
    )
});

export const DraftContactOutputSchema = z.union([
    z
        .object({
            success: z.boolean(),
            requiresUserReview: z.boolean(),
            message: z.string()
        })
        .strict(),
    z.object({ error: z.string() }).strict()
]);
