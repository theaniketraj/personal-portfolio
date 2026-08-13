import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/mdx";
import { MDXContent } from "@/components/mdx-content";
import { Breadcrumb } from "@/components/breadcrumb";
import Divider from "../../components/divider";

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
              <p className="text-lg text-secondary leading-relaxed font-(family-name:--font-space-grotesk)">
                {project.meta.description}
              </p>
            </div>

            {/* Structured MDX Body */}
            <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-8 pb-10 md:pb-14">
              <MDXContent source={project.content} />
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
                    <span className="text-xs font-mono uppercase text-secondary shrink-0">
                      &larr; Previous Project
                    </span>
                    <span className="line-clamp-1" title={prevProject.title}>{prevProject.title}</span>
                  </Link>
                ) : (
                  <Link
                    href="/projects"
                    className="text-xs font-mono uppercase text-secondary hover:text-primary transition-colors shrink-0"
                  >
                    &larr; All Projects
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
                    <span className="text-xs font-mono uppercase text-secondary shrink-0">
                      Next Project &rarr;
                    </span>
                    <span className="line-clamp-1" title={nextProject.title}>{nextProject.title}</span>
                  </Link>
                ) : (
                  <Link
                    href="/projects"
                    className="text-xs font-mono uppercase text-secondary hover:text-primary transition-colors shrink-0"
                  >
                    All Projects &rarr;
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Divider />
    </main>
  );
}
