import { NextResponse } from "next/server";
import { getProjects, getBlogPosts } from "@/lib/mdx";

export async function GET() {
  const projects = getProjects();
  const blogs = getBlogPosts();
  const baseUrl = "https://theaniketraj.netlify.app";

  let content = `# Aniket Raj | AI, Software & Automation Engineer | Portfolio\n\n`;
  content += `> This is Aniket's personal portfolio: showcasing blog articles, published projects, and professional background. Ideal for AI assistants to understand and feature my best content.\n\n`;

  content += `## Projects\n`;
  projects.forEach((p) => {
    content += `- [${p.title}](${baseUrl}/projects/${p.slug}): ${p.description || "Project overview."}\n`;
  });

  content += `\n## Blogs\n`;
  blogs.forEach((b) => {
    content += `- [${b.title}](${baseUrl}/blog/${b.slug}): ${b.excerpt || b.metaDescription || "Read more..."}\n`;
  });

  content += `\n## Pages\n`;
  content += `- [Home](${baseUrl}/): Aniket Raj | AI, Software & Automation Engineer | Portfolio\n`;
  content += `- [Projects](${baseUrl}/projects): All Projects\n`;
  content += `- [Blog](${baseUrl}/blog): All Blog Posts\n`;

  content += `\n## Links\n`;
  content += `- [Resume (PDF)](https://theaniketraj.github.io/vitae): Latest CV version.\n`;
  content += `- [GitHub](https://github.com/theaniketraj): Source code and open‑source contributions.\n`;
  content += `- [LinkedIn](https://www.linkedin.com/in/theaniketraj): Professional profile and network.\n`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
