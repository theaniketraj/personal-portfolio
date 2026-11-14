import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjects, getBlogPosts, slugifyTag } from '@/lib/mdx';
import { createOpenGraph } from '@/lib/content/profile';
import { UnifiedTagView } from '@/components/unified-tag-view';

export async function generateStaticParams() {
    await Promise.resolve();
    const posts = getBlogPosts();
    const allTags = new Set<string>();
    posts.forEach((post) => {
        post.tags?.forEach((tag) => {
            allTags.add(slugifyTag(tag));
        });
    });
    return Array.from(allTags).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
    const { tag } = await params;
    const projects = getProjects();
    const posts = getBlogPosts();

    const originalTag =
        projects.flatMap((p) => p.tags || []).find((t) => slugifyTag(t) === tag) ||
        posts.flatMap((p) => p.tags || []).find((t) => slugifyTag(t) === tag);

    const displayTag = originalTag || tag.replaceAll('-', ' ');

    const filteredProjects = projects.filter((project) => project.tags?.some((t) => slugifyTag(t) === tag));
    const filteredPosts = posts.filter((post) => post.tags?.some((t) => slugifyTag(t) === tag));

    const hasProjects = filteredProjects.length > 0;
    const hasPosts = filteredPosts.length > 0;

    let title: string;
    let description: string;

    if (hasProjects && hasPosts) {
        title = `Projects & Articles tagged with "${displayTag}"`;
        description = `Explore projects and technical articles tagged with ${displayTag} by Aniket Raj.`;
    } else if (hasProjects) {
        title = `Projects tagged with "${displayTag}"`;
        description = `Explore projects tagged with ${displayTag} by Aniket Raj.`;
    } else {
        title = `Articles tagged with "${displayTag}"`;
        description = `Explore technical articles tagged with ${displayTag} by Aniket Raj.`;
    }

    return {
        title,
        description,
        alternates: {
            canonical: `/tags/${tag}`
        },
        robots: {
            index: false,
            follow: true
        },
        openGraph: createOpenGraph({
            title: `${title} | Aniket Raj`,
            description,
            url: `/tags/${tag}`,
            type: 'website',
            images: [
                {
                    url: '/icon-512.png',
                    width: 512,
                    height: 512,
                    alt: title
                }
            ]
        })
    };
}

export default async function BlogTagPage({
    params
}: Readonly<{
    params: Promise<{ tag: string }>;
}>) {
    const { tag } = await params;
    const projects = getProjects();
    const posts = getBlogPosts();

    const originalTag =
        projects.flatMap((p) => p.tags || []).find((t) => slugifyTag(t) === tag) ||
        posts.flatMap((p) => p.tags || []).find((t) => slugifyTag(t) === tag);

    if (!originalTag) {
        notFound();
    }

    const filteredProjects = projects.filter((project) => project.tags?.some((t) => slugifyTag(t) === tag));
    const filteredPosts = posts.filter((post) => post.tags?.some((t) => slugifyTag(t) === tag));

    if (filteredProjects.length === 0 && filteredPosts.length === 0) {
        notFound();
    }

    return <UnifiedTagView originalTag={originalTag} tagSlug={tag} projects={filteredProjects} posts={filteredPosts} />;
}
