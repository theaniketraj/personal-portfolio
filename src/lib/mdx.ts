import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  ProjectSchema,
  ProjectMeta,
  ProjectData,
  BlogPostSchema,
  BlogPostMeta,
  BlogPostData,
} from "./content/types";

const PROJECTS_DIR = path.join(process.cwd(), "projects");
const BLOG_DIR = path.join(process.cwd(), "blog");

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Get all projects
export function getProjects(): ProjectMeta[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  const files = fs.readdirSync(PROJECTS_DIR);

  const projects = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const fullPath = path.join(PROJECTS_DIR, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      // Validate with Zod
      const parsedData = ProjectSchema.parse(data);

      return {
        slug,
        title: parsedData.title || slug,
        date:
          parsedData.date instanceof Date
            ? parsedData.date.toISOString().split("T")[0]
            : parsedData.date || "",
        client: parsedData.client || "Aniket Raj",
        description: parsedData.description || "",
        metaTitle: parsedData.metaTitle,
        metaDescription: parsedData.metaDescription,
        id: parsedData.id,
        tags: parsedData.tags || [],
        featured: parsedData.featured || false,
        featuredOrder: parsedData.featuredOrder || 0,
        roles: parsedData.roles || [],
        image: parsedData.image,
        domains: parsedData.domains || [],
        technologies: parsedData.technologies || [],
        engineeringAreas: parsedData.engineeringAreas || [],
        capabilities: parsedData.capabilities || [],
        status: parsedData.status || "active",
        relatedProjects: parsedData.relatedProjects || [],
        relatedArticles: parsedData.relatedArticles || [],
        readingTime: calculateReadingTime(content),
      } as ProjectMeta;
    });

  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getFeaturedProjects(): ProjectMeta[] {
  return getProjects()
    .filter((project) => project.featured)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
}

// Get single project by slug
export function getProjectBySlug(slug: string): ProjectData | null {
  const mdxPath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  const mdPath = path.join(PROJECTS_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;

  if (!filePath) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const parsedData = ProjectSchema.parse(data);

  return {
    meta: {
      slug,
      title: parsedData.title || slug,
      date:
        parsedData.date instanceof Date
          ? parsedData.date.toISOString().split("T")[0]
          : parsedData.date || "",
      client: parsedData.client || "Aniket Raj",
      description: parsedData.description || "",
      metaTitle: parsedData.metaTitle,
      metaDescription: parsedData.metaDescription,
      id: parsedData.id,
      tags: parsedData.tags || [],
      featured: parsedData.featured || false,
      featuredOrder: parsedData.featuredOrder || 0,
      roles: parsedData.roles || [],
      image: parsedData.image,
      domains: parsedData.domains || [],
      technologies: parsedData.technologies || [],
      engineeringAreas: parsedData.engineeringAreas || [],
      capabilities: parsedData.capabilities || [],
      status: parsedData.status || "active",
      relatedProjects: parsedData.relatedProjects || [],
      relatedArticles: parsedData.relatedArticles || [],
      readingTime: calculateReadingTime(content),
    },
    content,
  };
}

// Get all blog posts
export function getBlogPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR);

  const posts = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const fullPath = path.join(BLOG_DIR, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const parsedData = BlogPostSchema.parse(data);

      return {
        slug,
        title: parsedData.title || slug,
        date:
          parsedData.date instanceof Date
            ? parsedData.date.toISOString().split("T")[0]
            : parsedData.date || "",
        excerpt: parsedData.excerpt || "",
        author: parsedData.author || "Aniket Raj",
        metaTitle: parsedData.metaTitle,
        metaDescription: parsedData.metaDescription,
        id: parsedData.id,
        tags: parsedData.tags || [],
        topics: parsedData.topics || [],
        contentType: parsedData.contentType || [],
        relatedProjects: parsedData.relatedProjects || [],
        relatedArticles: parsedData.relatedArticles || [],
        readingTime: calculateReadingTime(content),
      } as BlogPostMeta;
    });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Get single blog post by slug
export function getBlogPostBySlug(slug: string): BlogPostData | null {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;

  if (!filePath) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const parsedData = BlogPostSchema.parse(data);

  return {
    meta: {
      slug,
      title: parsedData.title || slug,
      date:
        parsedData.date instanceof Date
          ? parsedData.date.toISOString().split("T")[0]
          : parsedData.date || "",
      excerpt: parsedData.excerpt || "",
      author: parsedData.author || "Aniket Raj",
      metaTitle: parsedData.metaTitle,
      metaDescription: parsedData.metaDescription,
      id: parsedData.id,
      tags: parsedData.tags || [],
      topics: parsedData.topics || [],
      contentType: parsedData.contentType || [],
      relatedProjects: parsedData.relatedProjects || [],
      relatedArticles: parsedData.relatedArticles || [],
      readingTime: calculateReadingTime(content),
    },
    content,
  };
}
