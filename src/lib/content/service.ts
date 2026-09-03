import {
  getProjects,
  getProjectBySlug,
  getBlogPosts,
  getBlogPostBySlug,
  getFeaturedProjects,
} from "@/lib/mdx";
import { ProjectMeta, ProjectData, BlogPostMeta, BlogPostData } from "./types";
import { profileData } from "./profile";

// A taxonomy alias map to normalize search terms
const TECHNOLOGY_ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  k8s: "kubernetes",
  reactjs: "react",
  next: "next.js",
  nextjs: "next.js",
};

function normalizeTerm(term: string): string {
  const lower = term.toLowerCase().trim();
  return TECHNOLOGY_ALIASES[lower] || lower;
}

export const PortfolioService = {
  getProfile() {
    return profileData;
  },

  searchProjects(params: {
    query?: string;
    domain?: string;
    technology?: string;
    status?: string;
    featuredOnly?: boolean;
    limit?: number;
    sort?: "relevance" | "date" | "featured";
  }): ProjectMeta[] {
    let projects = params.featuredOnly ? getFeaturedProjects() : getProjects();

    if (params.domain) {
      const normalizedDomain = normalizeTerm(params.domain);
      projects = projects.filter((p) =>
        p.domains?.some((d) => normalizeTerm(d) === normalizedDomain)
      );
    }

    if (params.technology) {
      const normalizedTech = normalizeTerm(params.technology);
      projects = projects.filter((p) =>
        p.technologies?.some((t) => normalizeTerm(t) === normalizedTech)
      );
    }

    if (params.status) {
      projects = projects.filter((p) => p.status === params.status);
    }

    let scoredProjects = projects.map(p => ({ project: p, score: 0 }));

    if (params.query) {
      const q = params.query.toLowerCase();
      scoredProjects.forEach(item => {
        const p = item.project;
        let score = 0;
        if (p.title.toLowerCase().includes(q)) score += 10;
        if (p.description?.toLowerCase().includes(q)) score += 5;
        if (p.domains?.some(d => d.toLowerCase().includes(q))) score += 3;
        if (p.technologies?.some(t => t.toLowerCase().includes(q))) score += 3;
        if (p.engineeringAreas?.some(e => e.toLowerCase().includes(q))) score += 3;
        item.score = score;
      });
      // Filter out zero score
      scoredProjects = scoredProjects.filter(item => item.score > 0);
    }

    // Sorting
    const sortOrder = params.sort || "relevance";
    if (sortOrder === "relevance" && params.query) {
      scoredProjects.sort((a, b) => b.score - a.score);
    } else if (sortOrder === "featured") {
      scoredProjects.sort((a, b) => {
        if (a.project.featured && !b.project.featured) return -1;
        if (!a.project.featured && b.project.featured) return 1;
        return 0;
      });
    } else if (sortOrder === "date") {
      scoredProjects.sort((a, b) => new Date(b.project.date).getTime() - new Date(a.project.date).getTime());
    }

    const finalProjects = scoredProjects.map(item => item.project);
    return finalProjects.slice(0, params.limit || 5);
  },

  getProjectSummary(slug: string) {
    const project = getProjectBySlug(slug);
    if (!project) return null;

    const meta = project.meta;
    const relatedProjects = meta.relatedProjects?.map(pSlug => {
      const p = getProjectBySlug(pSlug);
      return p ? { slug: p.meta.slug, title: p.meta.title, description: p.meta.description } : null;
    }).filter(Boolean);

    const relatedArticles = meta.relatedArticles?.map(aSlug => {
      const a = getBlogPostBySlug(aSlug);
      return a ? { slug: a.meta.slug, title: a.meta.title, excerpt: a.meta.excerpt } : null;
    }).filter(Boolean);

    return {
      ...meta,
      relatedProjectsDetails: relatedProjects,
      relatedArticlesDetails: relatedArticles,
    };
  },

  getProjectDetails(slug: string): ProjectData | null {
    return getProjectBySlug(slug);
  },

  searchArticles(params: {
    query?: string;
    topic?: string;
    tags?: string;
    contentType?: string;
    limit?: number;
    sort?: "relevance" | "date";
  }): BlogPostMeta[] {
    let articles = getBlogPosts();

    if (params.topic) {
      const normalizedTopic = normalizeTerm(params.topic);
      articles = articles.filter((a) =>
        a.topics?.some((t) => normalizeTerm(t) === normalizedTopic)
      );
    }
    
    if (params.tags) {
      const normalizedTag = normalizeTerm(params.tags);
      articles = articles.filter((a) =>
        a.tags?.some((t) => normalizeTerm(t) === normalizedTag)
      );
    }

    if (params.contentType) {
      const normalizedType = normalizeTerm(params.contentType);
      articles = articles.filter((a) =>
        a.contentType?.some((t) => normalizeTerm(t) === normalizedType)
      );
    }

    let scoredArticles = articles.map(a => ({ article: a, score: 0 }));

    if (params.query) {
      const q = params.query.toLowerCase();
      scoredArticles.forEach(item => {
        const a = item.article;
        let score = 0;
        if (a.title.toLowerCase().includes(q)) score += 10;
        if (a.excerpt?.toLowerCase().includes(q)) score += 5;
        if (a.topics?.some(t => t.toLowerCase().includes(q))) score += 3;
        if (a.tags?.some(t => t.toLowerCase().includes(q))) score += 3;
        item.score = score;
      });
      // Filter out zero score
      scoredArticles = scoredArticles.filter(item => item.score > 0);
    }

    // Sorting
    const sortOrder = params.sort || "relevance";
    if (sortOrder === "relevance" && params.query) {
      scoredArticles.sort((a, b) => b.score - a.score);
    } else if (sortOrder === "date") {
      scoredArticles.sort((a, b) => new Date(b.article.date).getTime() - new Date(a.article.date).getTime());
    }

    const finalArticles = scoredArticles.map(item => item.article);
    return finalArticles.slice(0, params.limit || 5);
  },

  getArticleSummary(slug: string) {
    const article = getBlogPostBySlug(slug);
    if (!article) return null;

    const meta = article.meta;
    const relatedProjects = meta.relatedProjects?.map(pSlug => {
      const p = getProjectBySlug(pSlug);
      return p ? { slug: p.meta.slug, title: p.meta.title, description: p.meta.description } : null;
    }).filter(Boolean);

    const relatedArticles = meta.relatedArticles?.map(aSlug => {
      const a = getBlogPostBySlug(aSlug);
      return a ? { slug: a.meta.slug, title: a.meta.title, excerpt: a.meta.excerpt } : null;
    }).filter(Boolean);

    return {
      ...meta,
      relatedProjectsDetails: relatedProjects,
      relatedArticlesDetails: relatedArticles,
    };
  },

  getArticleDetails(slug: string): BlogPostData | null {
    return getBlogPostBySlug(slug);
  },

  findRelevantWork(params: {
    role?: string;
    skills?: string[];
    domains?: string[];
    keywords?: string[];
    limit?: number;
  }) {
    // Score based matching
    const keywords = (params.keywords || []).map(normalizeTerm);
    const skills = (params.skills || []).map(normalizeTerm);
    const domains = (params.domains || []).map(normalizeTerm);
    const role = params.role ? normalizeTerm(params.role) : "";

    const allSearchTerms = [...keywords, ...skills, ...domains];
    if (role) allSearchTerms.push(role);

    if (allSearchTerms.length === 0) {
      return { projects: [], articles: [] };
    }

    const scoreProject = (p: ProjectMeta) => {
      let score = 0;
      const projectTerms = [
        p.title,
        ...(p.domains || []),
        ...(p.technologies || []),
        ...(p.engineeringAreas || []),
      ].map(normalizeTerm);

      for (const term of allSearchTerms) {
        if (projectTerms.some(pt => pt.includes(term) || term.includes(pt))) {
          score += 1;
        }
      }
      return score;
    };

    const scoreArticle = (a: BlogPostMeta) => {
      let score = 0;
      const articleTerms = [
        a.title,
        ...(a.topics || []),
        ...(a.tags || []),
      ].map(normalizeTerm);

      for (const term of allSearchTerms) {
        if (articleTerms.some(at => at.includes(term) || term.includes(at))) {
          score += 1;
        }
      }
      return score;
    };

    const scoredProjects = getProjects()
      .map(p => ({ project: p, score: scoreProject(p) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, params.limit || 3);

    const scoredArticles = getBlogPosts()
      .map(a => ({ article: a, score: scoreArticle(a) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, params.limit || 3);

    return {
      projects: scoredProjects,
      articles: scoredArticles
    };
  }
};
