import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "projects");
const BLOG_DIR = path.join(process.cwd(), "blog");

export interface ProjectMeta {
  slug: string;
  title: string;
  date: string;
  client?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaTags?: Array<{ property?: string; content?: string; name?: string }>;
  tags?: string[];
  readingTime?: number;
}

export interface ProjectData {
  meta: ProjectMeta;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaTags?: Array<{ property?: string; content?: string; name?: string }>;
  tags?: string[];
  readingTime?: number;
}

export interface BlogPostData {
  meta: BlogPostMeta;
  content: string;
}

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

      return {
        slug,
        title: data.title || slug,
        date:
          data.date instanceof Date
            ? data.date.toISOString().split("T")[0]
            : data.date || "",
        client: data.client || "Aniket Raj",
        description: data.description || "",
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaTags: data.metaTags,
        tags: data.tags || [],
        readingTime: calculateReadingTime(content),
      } as ProjectMeta;
    });

  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
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

  return {
    meta: {
      slug,
      title: data.title || slug,
      date:
        data.date instanceof Date
          ? data.date.toISOString().split("T")[0]
          : data.date || "",
      client: data.client || "Aniket Raj",
      description: data.description || "",
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaTags: data.metaTags,
      tags: data.tags || [],
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

      return {
        slug,
        title: data.title || slug,
        date:
          data.date instanceof Date
            ? data.date.toISOString().split("T")[0]
            : data.date || "",
        excerpt: data.excerpt || "",
        author: data.author || "Aniket Raj",
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaTags: data.metaTags,
        tags: data.tags || [],
        readingTime: calculateReadingTime(content),
      } as BlogPostMeta;
    });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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

  return {
    meta: {
      slug,
      title: data.title || slug,
      date:
        data.date instanceof Date
          ? data.date.toISOString().split("T")[0]
          : data.date || "",
      excerpt: data.excerpt || "",
      author: data.author || "Aniket Raj",
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaTags: data.metaTags,
      tags: data.tags || [],
      readingTime: calculateReadingTime(content),
    },
    content,
  };
}
