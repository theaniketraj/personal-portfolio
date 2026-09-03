import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().optional(),
  date: z.union([z.string(), z.date()]).optional(),
  client: z.string().optional(),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  id: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  featuredOrder: z.number().optional(),
  roles: z.array(z.string()).optional(),
  image: z.string().optional(),
  // WebMCP Semantic Taxonomy
  domains: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  engineeringAreas: z.array(z.string()).optional(),
  capabilities: z.array(z.string()).optional(),
  status: z.enum(["active", "completed", "archived"]).optional(),
  // Relationships
  relatedProjects: z.array(z.string()).optional(),
  relatedArticles: z.array(z.string()).optional(),
});

export type ProjectMeta = Omit<
  z.infer<typeof ProjectSchema>,
  "date" | "title"
> & {
  id?: string;
  slug: string;
  title: string;
  date: string;
  readingTime?: number;
};

export interface ProjectData {
  meta: ProjectMeta;
  content: string;
}

export const BlogPostSchema = z.object({
  title: z.string().optional(),
  date: z.union([z.string(), z.date()]).optional(),
  excerpt: z.string().optional(),
  author: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  id: z.string().optional(),
  tags: z.array(z.string()).optional(),
  // WebMCP Semantic Taxonomy
  topics: z.array(z.string()).optional(),
  contentType: z.array(z.string()).optional(),
  // Relationships
  relatedProjects: z.array(z.string()).optional(),
  relatedArticles: z.array(z.string()).optional(),
});

export type BlogPostMeta = Omit<
  z.infer<typeof BlogPostSchema>,
  "date" | "title"
> & {
  id?: string;
  slug: string;
  title: string;
  date: string;
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
