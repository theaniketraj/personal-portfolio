import { z } from "zod";

export const SearchProjectsSchema = z.object({
  query: z.string().max(100).optional().describe("Free-form text query for search"),
  domain: z
    .string()
    .optional()
    .describe("Filter by domain (e.g. Systems, AI, Web)"),
  technology: z
    .string()
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
  limit: z.number().int().min(1).max(20).default(5).describe("Max results to return"),
  sort: z.enum(["relevance", "date", "featured"]).default("relevance").describe("Sort order for results"),
});

export const SearchArticlesSchema = z.object({
  query: z.string().max(100).optional().describe("Free-form text query for search"),
  topic: z
    .string()
    .optional()
    .describe("Topic to filter by (e.g. 'Typescript', 'React')"),
  tags: z
    .string()
    .optional()
    .describe("Tag to filter by"),
  contentType: z
    .string()
    .optional()
    .describe("Content type to filter by (e.g., 'tutorial', 'essay')"),
  limit: z.number().int().min(1).max(20).default(5).describe("Max results to return"),
  sort: z.enum(["relevance", "date"]).default("relevance").describe("Sort order for results"),
});

export const FindRelevantWorkSchema = z.object({
  role: z.string().optional().describe("Target role (e.g., 'Backend Engineer')"),
  skills: z.array(z.string()).optional().describe("Relevant skills (e.g., ['Go', 'Docker'])"),
  domains: z.array(z.string()).optional().describe("Relevant domains (e.g., ['Distributed Systems'])"),
  keywords: z.array(z.string()).optional().describe("General keywords"),
  limit: z.number().int().min(1).max(10).default(3).describe("Max results to return"),
});

export const DraftContactSchema = z.object({
  firstName: z.string().describe("User's first name"),
  lastName: z.string().optional().describe("User's last name"),
  email: z.string().email().describe("User's email address"),
  message: z.string().describe("The message or project inquiry from the user"),
});

export const GetProjectSchema = z.object({
  slug: z.string().describe("The slug of the project (e.g. lexum, raptor)"),
});

export const GetArticleSchema = z.object({
  slug: z.string().describe("The slug of the article (e.g. tech-stack-wars)"),
});

export const EmptySchema = z.object({});

export const SearchProjectsJSONSchema = {
  type: "object",
  properties: {
    query: { type: "string", description: "Free-form text query for search" },
    domain: { type: "string", description: "Filter by domain (e.g. Systems, AI, Web)" },
    technology: { type: "string", description: "Filter by technology (e.g. Rust, TypeScript, Python)" },
    status: { type: "string", enum: ["active", "completed", "archived"], description: "Filter by project status" },
    featuredOnly: { type: "boolean", description: "Only return featured projects" },
    limit: { type: "integer", default: 5, description: "Max results to return" },
    sort: { type: "string", enum: ["relevance", "date", "featured"], default: "relevance", description: "Sort order for results" }
  }
};

export const SearchArticlesJSONSchema = {
  type: "object",
  properties: {
    query: { type: "string", description: "Free-form text query for search" },
    topic: { type: "string", description: "Topic to filter by (e.g. 'Typescript', 'React')" },
    tags: { type: "string", description: "Tag to filter by" },
    contentType: { type: "string", description: "Content type to filter by (e.g., 'tutorial', 'essay')" },
    limit: { type: "integer", default: 5, description: "Max results to return" },
    sort: { type: "string", enum: ["relevance", "date"], default: "relevance", description: "Sort order for results" }
  }
};

export const FindRelevantWorkJSONSchema = {
  type: "object",
  properties: {
    role: { type: "string", description: "Target role (e.g., 'Backend Engineer')" },
    skills: { type: "array", items: { type: "string" }, description: "Relevant skills (e.g., ['Go', 'Docker'])" },
    domains: { type: "array", items: { type: "string" }, description: "Relevant domains (e.g., ['Distributed Systems'])" },
    keywords: { type: "array", items: { type: "string" }, description: "General keywords" },
    limit: { type: "integer", default: 3, description: "Max results to return" }
  }
};

export const DraftContactJSONSchema = {
  type: "object",
  properties: {
    firstName: { type: "string", description: "User's first name" },
    lastName: { type: "string", description: "User's last name" },
    email: { type: "string", description: "User's email address" },
    message: { type: "string", description: "The message or project inquiry from the user" }
  },
  required: ["firstName", "email", "message"]
};

export const GetProjectJSONSchema = {
  type: "object",
  properties: {
    slug: { type: "string", description: "The slug of the project (e.g. lexum, raptor)" }
  },
  required: ["slug"]
};

export const GetArticleJSONSchema = {
  type: "object",
  properties: {
    slug: { type: "string", description: "The slug of the article (e.g. tech-stack-wars)" }
  },
  required: ["slug"]
};

export const EmptyJSONSchema = {
  type: "object",
  properties: {}
};
