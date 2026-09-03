import { z } from "zod";
import { registry } from "./registry";
import {
  SearchProjectsSchema,
  SearchArticlesSchema,
  GetProjectSchema,
  GetArticleSchema,
  EmptySchema,
  DraftContactSchema,
} from "./schemas";
import {
  getProjects,
  getProjectBySlug,
  getBlogPosts,
  getBlogPostBySlug,
  getFeaturedProjects,
} from "@/lib/mdx";
import { profileData } from "@/lib/content/profile";

// Register: get_profile
registry.registerTool({
  name: "get_profile",
  description: "Get Aniket's profile, including about me and core links",
  schema: EmptySchema,
  handler: () => {
    return profileData;
  },
});

// Register: search_projects
registry.registerTool({
  name: "search_projects",
  description: "Search Aniket's projects by domain, technology, or status",
  schema: SearchProjectsSchema,
  handler: (args) => {
    let projects = getProjects();

    if (args.featuredOnly) {
      projects = getFeaturedProjects();
    }

    if (args.domain) {
      projects = projects.filter((p) =>
        p.domains?.some((d) => d.toLowerCase() === args.domain!.toLowerCase()),
      );
    }
    if (args.technology) {
      projects = projects.filter((p) =>
        p.technologies?.some(
          (t) => t.toLowerCase() === args.technology!.toLowerCase(),
        ),
      );
    }
    if (args.status) {
      projects = projects.filter((p) => p.status === args.status);
    }

    return projects.map((p) => p);
  },
});

// Register: get_project
registry.registerTool({
  name: "get_project",
  description: "Get full details and content for a specific project by slug",
  schema: GetProjectSchema,
  handler: (args) => {
    try {
      const project = getProjectBySlug(args.slug);
      return project;
    } catch (e) {
      return { error: `Project not found: ${args.slug}` };
    }
  },
});

// Register: search_articles
registry.registerTool({
  name: "search_articles",
  description: "Search Aniket's blog articles by topic",
  schema: SearchArticlesSchema,
  handler: (args) => {
    let articles = getBlogPosts();

    if (args.topic) {
      articles = articles.filter((a) =>
        a.topics?.some((t) => t.toLowerCase() === args.topic!.toLowerCase()),
      );
    }

    return articles;
  },
});

// Register: get_article
registry.registerTool({
  name: "get_article",
  description: "Get full details and content for a specific article by slug",
  schema: GetArticleSchema,
  handler: (args) => {
    try {
      const article = getBlogPostBySlug(args.slug);
      return article;
    } catch (e) {
      return { error: `Article not found: ${args.slug}` };
    }
  },
});

// Register: find_relevant_work
registry.registerTool({
  name: "find_relevant_work",
  description: "Find related projects and articles for a given keyword",
  schema: z.object({ keyword: z.string() }),
  handler: (args) => {
    const keyword = args.keyword.toLowerCase();

    const relevantProjects = getProjects().filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.technologies?.some((t) => t.toLowerCase().includes(keyword)) ||
        p.domains?.some((d) => d.toLowerCase().includes(keyword)),
    );

    const relevantArticles = getBlogPosts().filter(
      (a) =>
        a.title.toLowerCase().includes(keyword) ||
        a.topics?.some((t) => t.toLowerCase().includes(keyword)),
    );

    return { projects: relevantProjects, articles: relevantArticles };
  },
});

// Register: draft_contact_message
registry.registerTool({
  name: "draft_contact_message",
  description:
    "Drafts a message to Aniket on behalf of the user. Automatically scrolls to the contact form and populates it. The user must manually review and click submit.",
  schema: DraftContactSchema,
  handler: (args) => {
    // The server doesn't actually send the message; it returns success
    // because the client-side WebMCPProvider will intercept this tool call
    // and physically populate the DOM form for human confirmation.
    return {
      status: "drafted",
      message:
        "The contact form has been drafted on the UI. The user must now click submit.",
      draftedData: args,
    };
  },
});
