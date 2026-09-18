import { z } from "zod";

export const SearchProjectsSchema = z
  .object({
    query: z
      .string()
      .trim()
      .max(100)
      .optional()
      .describe("Free-form text query for search"),
    domain: z
      .string()
      .trim()
      .max(50)
      .optional()
      .describe("Filter by domain (e.g. Systems, AI, Web)"),
    technology: z
      .string()
      .trim()
      .max(50)
      .optional()
      .describe("Filter by technology (e.g. Rust, TypeScript, Python)"),
    status: z
      .enum(["active", "completed", "archived"])
      .optional()
      .describe("Filter by project status"),
    featuredOnly: z
      .boolean()
      .optional()
      .describe("Only return featured projects"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(20)
      .default(5)
      .describe("Max results to return"),
    sort: z
      .enum(["relevance", "date", "featured"])
      .default("relevance")
      .describe("Sort order for results"),
  })
  .strict();

export const SearchArticlesSchema = z
  .object({
    query: z
      .string()
      .trim()
      .max(100)
      .optional()
      .describe("Free-form text query for search"),
    topic: z
      .string()
      .trim()
      .max(50)
      .optional()
      .describe("Topic to filter by (e.g. 'Typescript', 'React')"),
    tags: z.string().trim().max(50).optional().describe("Tag to filter by"),
    contentType: z
      .string()
      .trim()
      .max(50)
      .optional()
      .describe("Content type to filter by (e.g., 'tutorial', 'essay')"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(20)
      .default(5)
      .describe("Max results to return"),
    sort: z
      .enum(["relevance", "date"])
      .default("relevance")
      .describe("Sort order for results"),
  })
  .strict();

export const FindRelevantWorkSchema = z
  .object({
    role: z
      .string()
      .trim()
      .max(100)
      .optional()
      .describe("Target role (e.g., 'Backend Engineer')"),
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
    keywords: z
      .array(z.string().trim().min(1).max(50))
      .max(10)
      .optional()
      .describe("General keywords"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(10)
      .default(3)
      .describe("Max results to return"),
  })
  .strict();

export const DraftContactSchema = z
  .object({
    firstName: z.string().trim().max(100).describe("User's first name"),
    lastName: z
      .string()
      .trim()
      .max(100)
      .optional()
      .describe("User's last name"),
    email: z.string().trim().max(150).email().describe("User's email address"),
    message: z
      .string()
      .trim()
      .max(2000)
      .describe("The message or project inquiry from the user"),
  })
  .strict();

export const GetProjectSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .describe("The slug of the project (e.g. lexum, raptor)"),
  })
  .strict();

export const GetArticleSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .describe("The slug of the article (e.g. tech-stack-wars)"),
  })
  .strict();

export const EmptySchema = z.object({}).strict();

export const SearchProjectsJSONSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    query: { type: "string", description: "Free-form text query for search" },
    domain: {
      type: "string",
      description: "Filter by domain (e.g. Systems, AI, Web)",
    },
    technology: {
      type: "string",
      description: "Filter by technology (e.g. Rust, TypeScript, Python)",
    },
    status: {
      type: "string",
      enum: ["active", "completed", "archived"],
      description: "Filter by project status",
    },
    featuredOnly: {
      type: "boolean",
      description: "Only return featured projects",
    },
    limit: {
      type: "integer",
      default: 5,
      description: "Max results to return",
    },
    sort: {
      type: "string",
      enum: ["relevance", "date", "featured"],
      default: "relevance",
      description: "Sort order for results",
    },
  },
};

export const SearchArticlesJSONSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    query: { type: "string", description: "Free-form text query for search" },
    topic: {
      type: "string",
      description: "Topic to filter by (e.g. 'Typescript', 'React')",
    },
    tags: { type: "string", description: "Tag to filter by" },
    contentType: {
      type: "string",
      description: "Content type to filter by (e.g., 'tutorial', 'essay')",
    },
    limit: {
      type: "integer",
      default: 5,
      description: "Max results to return",
    },
    sort: {
      type: "string",
      enum: ["relevance", "date"],
      default: "relevance",
      description: "Sort order for results",
    },
  },
};

export const FindRelevantWorkJSONSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    role: {
      type: "string",
      description: "Target role (e.g., 'Backend Engineer')",
    },
    skills: {
      type: "array",
      items: { type: "string" },
      description: "Relevant skills (e.g., ['Go', 'Docker'])",
    },
    domains: {
      type: "array",
      items: { type: "string" },
      description: "Relevant domains (e.g., ['Distributed Systems'])",
    },
    keywords: {
      type: "array",
      items: { type: "string" },
      description: "General keywords",
    },
    limit: {
      type: "integer",
      default: 3,
      description: "Max results to return",
    },
  },
};

export const DraftContactJSONSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstName: { type: "string", description: "User's first name" },
    lastName: { type: "string", description: "User's last name" },
    email: { type: "string", description: "User's email address" },
    message: {
      type: "string",
      description: "The message or project inquiry from the user",
    },
  },
  required: ["firstName", "email", "message"],
};

export const GetProjectJSONSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slug: {
      type: "string",
      description: "The slug of the project (e.g. lexum, raptor)",
    },
  },
  required: ["slug"],
};

export const GetArticleJSONSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slug: {
      type: "string",
      description: "The slug of the article (e.g. tech-stack-wars)",
    },
  },
  required: ["slug"],
};

export const EmptyJSONSchema = {
  type: "object",
  additionalProperties: false,
  properties: {},
};

// --- OUTPUT SCHEMAS ---

export const ProfileOutputSchema = z
  .object({
    name: z.string(),
    role: z.string(),
    tagline: z.string(),
    about: z.string(),
    contact: z.object({
      email: z.string(),
      github: z.string(),
      linkedin: z.string(),
      twitter: z.string(),
    }),
    experienceCount: z.number(),
    projectCount: z.number(),
    articleCount: z.number(),
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
    featured: z.boolean().optional(),
  })
  .strict();

export const SearchProjectsOutputSchema = z.array(ProjectSummaryOutputSchema);

export const GetProjectOutputSchema = z.union([
  z.object({ error: z.string() }),
  ProjectSummaryOutputSchema.extend({
    relatedProjectsDetails: z.array(z.any()),
    relatedArticlesDetails: z.array(z.any()),
  }),
]);

export const GetProjectContentOutputSchema = z.union([
  z.object({ error: z.string() }),
  z.object({
    meta: ProjectSummaryOutputSchema,
    content: z.string(),
  }),
]);

export const ArticleSummaryOutputSchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    topics: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    contentType: z.array(z.string()).optional(),
  })
  .strict();

export const SearchArticlesOutputSchema = z.array(ArticleSummaryOutputSchema);

export const GetArticleOutputSchema = z.union([
  z.object({ error: z.string() }),
  ArticleSummaryOutputSchema.extend({
    relatedProjectsDetails: z.array(z.any()),
    relatedArticlesDetails: z.array(z.any()),
  }),
]);

export const GetArticleContentOutputSchema = z.union([
  z.object({ error: z.string() }),
  z.object({
    meta: ArticleSummaryOutputSchema,
    content: z.string(),
  }),
]);

export const FindRelevantWorkOutputSchema = z.object({
  projects: z.array(
    z.object({
      project: ProjectSummaryOutputSchema,
      score: z.number(),
      matches: z.array(z.string()),
      reason: z.string(),
    }),
  ),
  articles: z.array(
    z.object({
      article: ArticleSummaryOutputSchema,
      score: z.number(),
      matches: z.array(z.string()),
      reason: z.string(),
    }),
  ),
});

export const DraftContactOutputSchema = z.union([
  z.object({ success: z.boolean(), message: z.string() }),
  z.object({ error: z.string() }),
]);
