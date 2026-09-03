import { MetadataRoute } from "next";
import { getBlogPosts, getProjects } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://theaniketraj.netlify.app";

  // Static routes
  const routes = ["", "/blog", "/projects"].map((route) => ({
    url: `${baseUrl}${route}`,
  }));

  // Dynamic Blog routes
  const blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || new Date()).toISOString().split("T")[0],
  }));

  // Dynamic Project routes
  const projects = getProjects().map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    // If project has no date, default to current date
    lastModified: new Date(project.date || new Date())
      .toISOString()
      .split("T")[0],
  }));

  return [...routes, ...blogs, ...projects];
}
