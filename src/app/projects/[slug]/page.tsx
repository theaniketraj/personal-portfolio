import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjects, getProjectBySlug, getBlogPosts, slugifyTag } from '@/lib/mdx';
import { extractHeadings } from '@/lib/toc';
import { MDXContent } from '@/components/mdx-content';
import { Breadcrumb } from '@/components/breadcrumb';
import { TableOfContents } from '@/components/table-of-contents';
import { createOpenGraph, profileData } from '@/lib/content/profile';
import { createProjectJsonLd } from '@/lib/content/project-jsonld';
import { getProjectOgImage } from '@/lib/og';
import { serializeJsonLd } from '@/lib/jsonld';
import type { ProjectMeta, BlogPostMeta } from '@/lib/content/types';

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    await Promise.resolve();
    const projects = getProjects();
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) return { title: 'Project Not Found' };

    const title = project.meta.metaTitle || project.meta.title;
    const description = project.meta.metaDescription || project.meta.description;
    const ogImage = getProjectOgImage(slug, title);

    return {
        title,
        description,
        alternates: {
            canonical: `/projects/${slug}`
        },
        openGraph: createOpenGraph({
            title,
            description,
            url: `/projects/${slug}`,
            type: 'article',
            images: [
                {
                    url: ogImage.url,
                    alt: ogImage.alt,
                    type: ogImage.type
                }
            ]
        }),
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage.url]
        }
    };
}

export default async function ProjectDetailPage({ params }: Readonly<ProjectPageProps>) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const allProjects = getProjects();
    const allPosts = getBlogPosts();
    const currentIndex = allProjects.findIndex((p) => p.slug === slug);
    const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
    const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

    const relatedProjects = (project.meta.relatedProjects || [])
        .map((pSlug) => allProjects.find((p) => p.slug === pSlug))
        .filter((p): p is ProjectMeta => Boolean(p));

    const relatedArticles = (project.meta.relatedArticles || [])
        .map((aSlug) => allPosts.find((p) => p.slug === aSlug))
        .filter((a): a is BlogPostMeta => Boolean(a));

    const hasRelated = relatedProjects.length > 0 || relatedArticles.length > 0;

    const jsonLd = createProjectJsonLd({
        project,
        slug,
        relatedProjects,
        relatedArticles
    });

    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        >
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
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
                                <div className="text-sm text-secondary font-(family-name:--font-space-grotesk) flex items-center h-7.5 cursor-default select-none">
                                    <time dateTime={project.meta.date}>{project.meta.date}</time>
                                    <span className="sr-only">, created by {profileData.name}</span>
                                </div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-4 font-(family-name:--font-space-grotesk) cursor-default">
                                {project.meta.title}
                            </h1>
                            <p className="text-lg text-secondary leading-relaxed font-(family-name:--font-space-grotesk) mb-6 cursor-default">
                                {project.meta.description}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                                <div className="group text-sm font-mono text-secondary/80 flex items-center gap-1.5 shrink-0 cursor-default select-none hover:text-primary transition-colors duration-300">
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
                                        aria-hidden="true"
                                        className="transition-transform duration-500 ease-out group-hover:rotate-180 group-hover:scale-110"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    {project.meta.readingTime} min read
                                </div>
                                {project.meta.tags && project.meta.tags.length > 0 && (
                                    <div className="flex flex-wrap items-center sm:justify-end gap-1.5">
                                        <span className="text-sm font-medium text-secondary cursor-default">Tags:</span>
                                        {project.meta.tags.map((tag, i) => (
                                            <React.Fragment key={tag}>
                                                <Link
                                                    href={`/tags/${slugifyTag(tag)}`}
                                                    className="group relative inline-block text-secondary hover:text-primary text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                                                >
                                                    {tag}
                                                    <span className="absolute left-0 -bottom-0.5 h-px w-full bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                                                </Link>
                                                {i < project.meta.tags!.length - 1 && (
                                                    <span className="text-secondary text-sm cursor-default">,</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Structured MDX Body */}
                        <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-8 pb-10 md:pb-14 relative cursor-default">
                            <MDXContent source={project.content} />

                            {/* Table of Contents - Hidden on mobile, visible on XL screens */}
                            <div className="hidden xl:block fixed top-1/2 -translate-y-1/2 right-4 w-auto z-50">
                                <TableOfContents headings={extractHeadings(project.content)} />
                            </div>
                        </div>

                        {/* Related Work & Connected Systems (Accessible in DOM for AI agents & crawlers; visually hidden to eliminate UI clutter) */}
                        {hasRelated && (
                            <nav
                                aria-label="Related Systems and Deep Dives"
                                className="sr-only focus-within:not-sr-only focus-within:relative focus-within:block focus-within:max-w-3xl focus-within:mx-auto focus-within:px-4 focus-within:py-4 focus-within:border-t focus-within:border-primary/10"
                            >
                                <h2 className="text-lg font-semibold text-primary mb-2">
                                    Related Systems & Deep Dives
                                </h2>
                                <ul className="space-y-1">
                                    {relatedProjects.map((rp) => (
                                        <li key={rp.slug}>
                                            <Link
                                                href={`/projects/${rp.slug}`}
                                                className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xs"
                                            >
                                                {rp.title}: {rp.description}
                                            </Link>
                                        </li>
                                    ))}
                                    {relatedArticles.map((ra) => (
                                        <li key={ra.slug}>
                                            <Link
                                                href={`/blog/${ra.slug}`}
                                                className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xs"
                                            >
                                                {ra.title}: {ra.excerpt}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}

                        {/* Next / Previous Project Navigation */}
                        <nav aria-label="Project navigation" className="max-w-3xl mx-auto border-t border-primary/10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-primary/10">
                                {/* Previous Project Bay */}
                                <div className="flex">
                                    {prevProject ? (
                                        <Link
                                            href={`/projects/${prevProject.slug}`}
                                            aria-label={`Previous project: ${prevProject.title}`}
                                            className="group relative flex flex-col justify-between w-full px-4 sm:px-7 py-6 sm:py-7 text-left transition-colors duration-200 hover:bg-primary/2 dark:hover:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                                        >
                                            {/* Laser accent line on top edge */}
                                            <span
                                                aria-hidden="true"
                                                className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#5B45D6] via-[#9282F8] to-[#B86E00] dark:from-[#9282F8] dark:via-[#5B45D6] dark:to-[#F3CA4D] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                                            />

                                            <span className="text-[11px] font-mono uppercase tracking-[2px] text-secondary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex items-center gap-2 mb-3 select-none">
                                                <span className="relative inline-flex items-center justify-center w-3.5 h-3.5 overflow-hidden shrink-0">
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
                                                        aria-hidden="true"
                                                        className="transition-all duration-300 ease-out group-hover:-translate-x-full group-hover:opacity-0"
                                                    >
                                                        <path d="m12 19-7-7 7-7" />
                                                        <path d="M19 12H5" />
                                                    </svg>
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
                                                        aria-hidden="true"
                                                        className="absolute inset-0 translate-x-full opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                                                    >
                                                        <path d="m12 19-7-7 7-7" />
                                                        <path d="M19 12H5" />
                                                    </svg>
                                                </span>
                                                Previous Project{' '}
                                            </span>

                                            <span
                                                className="text-base sm:text-lg font-medium text-primary font-(family-name:--font-space-grotesk) line-clamp-2 leading-snug tracking-tight select-none"
                                                title={prevProject.title}
                                            >
                                                {prevProject.title}
                                            </span>
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/projects"
                                            className="group relative flex flex-col justify-between w-full px-4 sm:px-7 py-6 sm:py-7 text-left transition-colors duration-200 hover:bg-primary/2 dark:hover:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#5B45D6] via-[#9282F8] to-[#B86E00] dark:from-[#9282F8] dark:via-[#5B45D6] dark:to-[#F3CA4D] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                                            />

                                            <span className="text-[11px] font-mono uppercase tracking-[2px] text-secondary group-hover:text-primary transition-colors flex items-center gap-2 mb-3 select-none">
                                                <span className="relative inline-flex items-center justify-center w-3.5 h-3.5 overflow-hidden shrink-0">
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
                                                        aria-hidden="true"
                                                        className="transition-all duration-300 ease-out group-hover:-translate-x-full group-hover:opacity-0"
                                                    >
                                                        <path d="m12 19-7-7 7-7" />
                                                        <path d="M19 12H5" />
                                                    </svg>
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
                                                        aria-hidden="true"
                                                        className="absolute inset-0 translate-x-full opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                                                    >
                                                        <path d="m12 19-7-7 7-7" />
                                                        <path d="M19 12H5" />
                                                    </svg>
                                                </span>
                                                All Projects{' '}
                                            </span>

                                            <span className="text-base sm:text-lg font-medium text-secondary group-hover:text-primary font-(family-name:--font-space-grotesk) transition-colors line-clamp-2 leading-snug tracking-tight select-none">
                                                Return to Projects Overview
                                            </span>
                                        </Link>
                                    )}
                                </div>

                                {/* Next Project Bay */}
                                <div className="flex">
                                    {nextProject ? (
                                        <Link
                                            href={`/projects/${nextProject.slug}`}
                                            aria-label={`Next project: ${nextProject.title}`}
                                            className="group relative flex flex-col justify-between w-full px-4 sm:px-7 py-6 sm:py-7 text-right transition-colors duration-200 hover:bg-primary/2 dark:hover:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                                        >
                                            {/* Laser accent line on top edge */}
                                            <span
                                                aria-hidden="true"
                                                className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#B86E00] via-[#9282F8] to-[#5B45D6] dark:from-[#F3CA4D] dark:via-[#5B45D6] dark:to-[#9282F8] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                                            />

                                            <span className="text-[11px] font-mono uppercase tracking-[2px] text-secondary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex items-center justify-end gap-2 mb-3 select-none">
                                                Next Project{' '}
                                                <span className="relative inline-flex items-center justify-center w-3.5 h-3.5 overflow-hidden shrink-0">
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
                                                        aria-hidden="true"
                                                        className="transition-all duration-300 ease-out group-hover:translate-x-full group-hover:opacity-0"
                                                    >
                                                        <path d="M5 12h14" />
                                                        <path d="m12 5 7 7-7 7" />
                                                    </svg>
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
                                                        aria-hidden="true"
                                                        className="absolute inset-0 -translate-x-full opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                                                    >
                                                        <path d="M5 12h14" />
                                                        <path d="m12 5 7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </span>

                                            <span
                                                className="text-base sm:text-lg font-medium text-primary font-(family-name:--font-space-grotesk) line-clamp-2 leading-snug tracking-tight select-none"
                                                title={nextProject.title}
                                            >
                                                {nextProject.title}
                                            </span>
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/projects"
                                            className="group relative flex flex-col justify-between w-full px-4 sm:px-7 py-6 sm:py-7 text-right transition-colors duration-200 hover:bg-primary/2 dark:hover:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#B86E00] via-[#9282F8] to-[#5B45D6] dark:from-[#F3CA4D] dark:via-[#5B45D6] dark:to-[#9282F8] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                                            />

                                            <span className="text-[11px] font-mono uppercase tracking-[2px] text-secondary group-hover:text-primary transition-colors flex items-center justify-end gap-2 mb-3 select-none">
                                                All Projects{' '}
                                                <span className="relative inline-flex items-center justify-center w-3.5 h-3.5 overflow-hidden shrink-0">
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
                                                        aria-hidden="true"
                                                        className="transition-all duration-300 ease-out group-hover:translate-x-full group-hover:opacity-0"
                                                    >
                                                        <path d="M5 12h14" />
                                                        <path d="m12 5 7 7-7 7" />
                                                    </svg>
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
                                                        aria-hidden="true"
                                                        className="absolute inset-0 -translate-x-full opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                                                    >
                                                        <path d="M5 12h14" />
                                                        <path d="m12 5 7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </span>

                                            <span className="text-base sm:text-lg font-medium text-secondary group-hover:text-primary font-(family-name:--font-space-grotesk) transition-colors line-clamp-2 leading-snug tracking-tight select-none">
                                                Return to Projects Overview
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </section>
        </main>
    );
}
