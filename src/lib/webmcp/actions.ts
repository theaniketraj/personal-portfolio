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
} from "./schemas";
import { PortfolioService } from "@/lib/content/service";
import type { Profile } from "@/lib/content/profile";

// Register: get_profile
registry.registerTool<unknown, Profile>({
  name: "get_profile",
  title: "Get Profile",
  description: "Get Aniket's profile, including about me and core links",
  schema: EmptySchema,
  jsonSchema: EmptyJSONSchema,
  scope: "global",
  readOnly: true,
  handler: () => {
    return PortfolioService.getProfile();
  },
});

// Register: search_projects
registry.registerTool({
  name: "search_projects",
  title: "Search Projects",
  description: "Search Aniket's projects by domain, technology, or status. Returns a summary of each project.",
  schema: SearchProjectsSchema,
  jsonSchema: SearchProjectsJSONSchema,
  scope: "global",
  readOnly: true,
  handler: (args) => {
    return PortfolioService.searchProjects(args);
  },
});

// Register: get_project
registry.registerTool({
  name: "get_project",
  title: "Get Project Metadata",
  description: "Get structured metadata for a specific project by slug.",
  schema: GetProjectSchema,
  jsonSchema: GetProjectJSONSchema,
  scope: "project",
  readOnly: true,
  handler: (args) => {
    const project = PortfolioService.getProjectSummary(args.slug);
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
  scope: "project",
  readOnly: true,
  untrustedContentHint: true,
  handler: (args) => {
    const project = PortfolioService.getProjectDetails(args.slug);
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
  scope: "global",
  readOnly: true,
  handler: (args) => {
    return PortfolioService.searchArticles(args);
  },
});

// Register: get_article
registry.registerTool({
  name: "get_article",
  title: "Get Article Metadata",
  description: "Get structured metadata for a specific article by slug.",
  schema: GetArticleSchema,
  jsonSchema: GetArticleJSONSchema,
  scope: "article",
  readOnly: true,
  handler: (args) => {
    const article = PortfolioService.getArticleSummary(args.slug);
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
  scope: "article",
  readOnly: true,
  untrustedContentHint: true,
  handler: (args) => {
    const article = PortfolioService.getArticleDetails(args.slug);
    if (!article) return { error: `Article not found: ${args.slug}` };
    return article;
  },
});

// Register: find_relevant_work
registry.registerTool({
  name: "find_relevant_work",
  title: "Find Relevant Work",
  description: "Semantic search for finding relevant projects and articles based on roles, skills, and domains.",
  schema: FindRelevantWorkSchema,
  jsonSchema: FindRelevantWorkJSONSchema,
  scope: "global",
  readOnly: true,
  handler: (args) => {
    return PortfolioService.findRelevantWork(args);
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
  scope: "contact",
  readOnly: false,
  handler: (args) => {
    // The client-side WebMCPProvider intercepts this tool call and sets the drafted context state.
    return {
      status: "drafted",
      message: "The contact form has been drafted on the UI. The user must now click submit.",
      draftedData: args,
    };
  },
});

