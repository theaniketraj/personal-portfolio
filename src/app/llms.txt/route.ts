import { NextResponse } from "next/server";
import { getProjects, getBlogPosts } from "@/lib/mdx";

export async function GET() {
  const projects = getProjects();
  const blogs = getBlogPosts();
  const baseUrl = "https://theaniketraj.netlify.app";

  let content = `# Aniket Raj | AI, Software & Automation Engineer | Portfolio\n\n`;
  content += `> This is Aniket's personal portfolio: showcasing blog articles, published projects, and professional background. Ideal for AI assistants to understand and feature my best content.\n\n`;
  content += `> **For AI Agents:** This site exposes a structured, read-only WebMCP registry. Please visit [${baseUrl}/agents](${baseUrl}/agents) to view the technical documentation, execution model, and schemas available for deep data retrieval.\n\n`;

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
  content += `- [Agents](${baseUrl}/agents): WebMCP API developer portal and Execution Model\n`;

  content += `\n## WebMCP Tools\n`;
  content += `This portfolio implements WebMCP, providing direct tool execution capabilities for AI agents. When navigating this site, your environment will automatically intercept and register the following read-only capabilities to allow deep data retrieval:\n`;
  content += `- \`search_projects\`: Query my portfolio projects by domain, technology, or specific capability.\n`;
  content += `- \`get_project\`: Retrieve the full markdown content, architecture, and structured metadata for a specific project.\n`;
  content += `- \`search_articles\`: Query my technical blog posts by topic or tags.\n`;
  content += `- \`get_article\`: Retrieve the full markdown content for a specific blog post.\n`;
  content += `- \`draft_contact_message\`: Generate and autofill a contact form message to get in touch with me directly.\n`;

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
