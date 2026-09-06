import { registry } from "./registry";
import {
  SearchProjectsSchema,
  SearchArticlesSchema,
  GetProjectSchema,
  GetArticleSchema,
  EmptySchema,
  DraftContactSchema,
  FindRelevantWorkSchema,
  EmptyJSONSchema,
  SearchProjectsJSONSchema,
  GetProjectJSONSchema,
  SearchArticlesJSONSchema,
  GetArticleJSONSchema,
  FindRelevantWorkJSONSchema,
  DraftContactJSONSchema,
  ProfileOutputSchema,
  SearchProjectsOutputSchema,
  GetProjectOutputSchema,
  GetProjectContentOutputSchema,
  SearchArticlesOutputSchema,
  GetArticleOutputSchema,
  GetArticleContentOutputSchema,
  FindRelevantWorkOutputSchema,
  DraftContactOutputSchema,
} from "./schemas";
import { PortfolioService } from "@/lib/content/portfolio";
import {
  getProjects,
  getProjectBySlug,
  getBlogPosts,
  getBlogPostBySlug,
} from "@/lib/mdx";
import type { Profile } from "@/lib/content/profile";

// Register: get_profile
registry.registerTool<unknown, Profile & { experienceCount: number; projectCount: number; articleCount: number }>({
  name: "get_profile",
  title: "Get Profile",
  description: "Get Aniket's profile, including about me and core links",
  schema: EmptySchema,
  jsonSchema: EmptyJSONSchema,
  outputSchema: ProfileOutputSchema as any,
  scope: "site",
  kind: "query",
  toolVersion: 1,
  handler: () => {
    return PortfolioService.getProfile(getProjects().length, getBlogPosts().length);
  },
});

// Register: search_projects
registry.registerTool({
  name: "search_projects",
  title: "Search Projects",
  description: "Search Aniket's projects by domain, technology, or status. Returns a summary of each project.",
  schema: SearchProjectsSchema,
  jsonSchema: SearchProjectsJSONSchema,
  outputSchema: SearchProjectsOutputSchema as any,
  scope: "project-route",
  kind: "query",
  toolVersion: 1,
  handler: (args) => {
    return PortfolioService.searchProjects(getProjects(), args);
  },
});

// Register: get_project
registry.registerTool({
  name: "get_project",
  title: "Get Project Metadata",
  description: "Retrieve concise structured information about a specific project, including its purpose, technologies, domains, engineering areas, status, and resources. Use this after identifying a project with search_projects.",
  schema: GetProjectSchema,
  jsonSchema: GetProjectJSONSchema,
  outputSchema: GetProjectOutputSchema as any,
  scope: "project-route",
  kind: "query",
  toolVersion: 1,
  handler: (args) => {
    const project = PortfolioService.getProjectSummary(getProjects(), getBlogPosts(), args.slug);
    if (!project) return { error: `Project not found: ${args.slug}` };
    return project;
  },
});

// Register: get_project_content
registry.registerTool({
  name: "get_project_content",
  title: "Get Project Content",
  description: "Get full markdown content and details for a specific project by slug.",
  schema: GetProjectSchema,
  jsonSchema: GetProjectJSONSchema,
  outputSchema: GetProjectContentOutputSchema as any,
  scope: "project-route",
  kind: "query",
  untrustedContentHint: true,
  toolVersion: 1,
  handler: (args) => {
    const project = getProjectBySlug(args.slug);
    if (!project) return { error: `Project not found: ${args.slug}` };
    return project;
  },
});

// Register: search_articles
registry.registerTool({
  name: "search_articles",
  title: "Search Articles",
  description: "Search Aniket's blog articles by topic or query.",
  schema: SearchArticlesSchema,
  jsonSchema: SearchArticlesJSONSchema,
  outputSchema: SearchArticlesOutputSchema as any,
  scope: "article-route",
  kind: "query",
  toolVersion: 1,
  handler: (args) => {
    return PortfolioService.searchArticles(getBlogPosts(), args);
  },
});

// Register: get_article
registry.registerTool({
  name: "get_article",
  title: "Get Article Metadata",
  description: "Get structured metadata for a specific article by slug.",
  schema: GetArticleSchema,
  jsonSchema: GetArticleJSONSchema,
  outputSchema: GetArticleOutputSchema as any,
  scope: "article-route",
  kind: "query",
  toolVersion: 1,
  handler: (args) => {
    const article = PortfolioService.getArticleSummary(getProjects(), getBlogPosts(), args.slug);
    if (!article) return { error: `Article not found: ${args.slug}` };
    return article;
  },
});

// Register: get_article_content
registry.registerTool({
  name: "get_article_content",
  title: "Get Article Content",
  description: "Get full markdown content and details for a specific article by slug.",
  schema: GetArticleSchema,
  jsonSchema: GetArticleJSONSchema,
  outputSchema: GetArticleContentOutputSchema as any,
  scope: "article-route",
  kind: "query",
  untrustedContentHint: true,
  toolVersion: 1,
  handler: (args) => {
    const article = getBlogPostBySlug(args.slug);
    if (!article) return { error: `Article not found: ${args.slug}` };
    return article;
  },
});

// Register: find_relevant_work
registry.registerTool({
  name: "find_relevant_work",
  title: "Find Relevant Work",
  description: "Deterministic relevance matching to find projects and articles based on roles, skills, and domains.",
  schema: FindRelevantWorkSchema,
  jsonSchema: FindRelevantWorkJSONSchema,
  outputSchema: FindRelevantWorkOutputSchema as any,
  scope: "site",
  kind: "query",
  toolVersion: 1,
  handler: (args) => {
    return PortfolioService.findRelevantWork(getProjects(), getBlogPosts(), args);
  },
});

// Register: draft_contact_message
registry.registerTool({
  name: "draft_contact_message",
  title: "Draft Contact Message",
  description:
    "Drafts a message to Aniket on behalf of the user. Automatically populates the contact form. The user must manually review and click submit.",
  schema: DraftContactSchema,
  jsonSchema: DraftContactJSONSchema,
  outputSchema: DraftContactOutputSchema as any,
  scope: "contact",
  kind: "mutation",
  toolVersion: 1,
  handler: (args) => {
    return {
      success: true,
      message: "Contact form draft populated successfully. The user must now review and send it.",
      draftedData: args,
    };
  },
});
