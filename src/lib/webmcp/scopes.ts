import { ToolScope } from "./registry";

export function shouldRegisterToolForRoute(
  toolName: string,
  toolScope: ToolScope,
  pathname: string
): boolean {
  if (toolScope === "site") return true;

  if (toolScope === "project-route") {
    const isProjectList = pathname === "/projects";
    const isProjectDetail =
      pathname.startsWith("/projects/") && pathname.length > "/projects/".length;

    if (toolName === "search_projects" && !isProjectList) return false;
    if (toolName.startsWith("get_project") && !isProjectDetail) return false;
    if (!pathname.startsWith("/projects")) return false;
    return true;
  }

  if (toolScope === "article-route") {
    const isArticleList = pathname === "/blog";
    const isArticleDetail =
      pathname.startsWith("/blog/") && pathname.length > "/blog/".length;

    if (toolName === "search_articles" && !isArticleList) return false;
    if (toolName.startsWith("get_article") && !isArticleDetail) return false;
    if (!pathname.startsWith("/blog")) return false;
    return true;
  }

  if (toolScope === "contact") {
    return pathname === "/";
  }

  return false;
}
