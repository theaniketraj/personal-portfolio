import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/mdx";
import { extractHeadings } from "@/lib/toc";
import { MDXContent } from "@/components/mdx-content";
import { Breadcrumb } from "@/components/breadcrumb";
import { TableOfContents } from "@/components/table-of-contents";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.meta.metaTitle || project.meta.title,
    description: project.meta.metaDescription || project.meta.description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: project.meta.metaTitle || project.meta.title,
      description: project.meta.metaDescription || project.meta.description,
      url: `/projects/${slug}`,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: Readonly<ProjectPageProps>) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = getProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <main>
      <section>
        <div className="container">
          <div className="border-x border-primary/10">
            {/* Header / Docs Metadata */}
            <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-10 md:pt-14 pb-8 border-b border-primary/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <Breadcrumb
                  backHref="/projects"
                  backLabel="All Projects"
                  items={[{ label: project.meta.title }]}
                />
                <div className="text-sm text-secondary font-(family-name:--font-space-grotesk) flex items-center h-7.5">
                  {project.meta.date}
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-4 font-(family-name:--font-space-grotesk)">
                {project.meta.title}
              </h1>
              <p className="text-lg text-secondary leading-relaxed font-(family-name:--font-space-grotesk) mb-6">
                {project.meta.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                <div className="group text-sm font-mono text-secondary/80 flex items-center gap-1.5 shrink-0 cursor-default hover:text-primary transition-colors duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-500 ease-out group-hover:rotate-180 group-hover:scale-110"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {project.meta.readingTime} min read
                </div>
                {project.meta.tags && project.meta.tags.length > 0 && (
                  <div className="flex flex-wrap items-center sm:justify-end gap-1.5">
                    <span className="text-sm font-medium text-secondary">
                      Tags:
                    </span>
                    {project.meta.tags.map((tag, i) => (
                      <React.Fragment key={tag}>
                        <Link
                          href={`/projects/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                          className="group relative inline-block text-secondary hover:text-primary text-sm font-medium transition-colors"
                        >
                          {tag}
                          <span className="absolute left-0 -bottom-0.5 h-px w-full bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                        </Link>
                        {i < project.meta.tags!.length - 1 && (
                          <span className="text-secondary text-sm">,</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Structured MDX Body */}
            <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-8 pb-10 md:pb-14 relative">
              <MDXContent source={project.content} />

              {/* Table of Contents - Hidden on mobile, visible on XL screens */}
              <div className="hidden xl:block fixed top-1/2 -translate-y-1/2 right-4 w-auto z-50">
                <TableOfContents headings={extractHeadings(project.content)} />
              </div>
            </div>

            {/* Next / Previous Project Navigation */}
            <div className="max-w-3xl mx-auto px-4 sm:px-7 py-8 border-t border-primary/10 flex justify-between items-center gap-4 text-sm font-medium">
              <div className="flex-1 min-w-0">
                {prevProject ? (
                  <Link
                    href={`/projects/${prevProject.slug}`}
                    aria-label={`Previous project: ${prevProject.title}`}
                    className="group flex flex-col gap-1 text-left text-primary hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    <span className="text-xs font-mono uppercase text-secondary shrink-0 flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:-translate-x-1"
                      >
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                      </svg>
                      Previous Project
                    </span>
                    <span className="line-clamp-1" title={prevProject.title}>
                      {prevProject.title}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/projects"
                    className="text-xs font-mono uppercase text-secondary hover:text-primary transition-colors shrink-0"
                  >
                    <span className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:-translate-x-1"
                      >
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                      </svg>{" "}
                      All Projects
                    </span>
                  </Link>
                )}
              </div>

              <div className="flex-1 min-w-0 text-right">
                {nextProject ? (
                  <Link
                    href={`/projects/${nextProject.slug}`}
                    aria-label={`Next project: ${nextProject.title}`}
                    className="group flex flex-col gap-1 text-right text-primary hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    <span className="text-xs font-mono uppercase text-secondary shrink-0 flex items-center justify-end gap-1.5">
                      Next Project
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                    <span className="line-clamp-1" title={nextProject.title}>
                      {nextProject.title}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/projects"
                    className="text-xs font-mono uppercase text-secondary hover:text-primary transition-colors shrink-0"
                  >
                    <span className="flex items-center justify-end gap-1.5">
                      All Projects{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
