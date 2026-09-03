import { z } from "zod";

export const SearchProjectsSchema = z.object({
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
});

export const SearchArticlesSchema = z.object({
  topic: z
    .string()
    .optional()
    .describe("Topic to filter by (e.g. 'Typescript', 'React')"),
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
