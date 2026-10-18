import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, slugifyTag } from '@/lib/mdx';
import { HardwareAnimated } from '@/components/animations/hardware-animated';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/breadcrumb';
import { createOpenGraph } from '@/lib/content/profile';

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
    const posts = getBlogPosts();
    const originalTag = posts.flatMap((p) => p.tags || []).find((t) => slugifyTag(t) === tag);
    const displayTag = originalTag || tag.replaceAll('-', ' ');
    const title = `Articles tagged with "${displayTag}"`;
    const description = `A collection of articles tagged with ${displayTag} by Aniket Raj.`;
    return {
        title,
        description,
        alternates: {
            canonical: `/blog/tags/${tag}`
        },
        robots: {
            index: false,
            follow: true
        },
        openGraph: createOpenGraph({
            title: `${title} | Aniket Raj`,
            description,
            url: `/blog/tags/${tag}`,
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
    const posts = getBlogPosts();

    const originalTag = posts.flatMap((p) => p.tags || []).find((t) => slugifyTag(t) === tag);

    if (!originalTag) {
        notFound();
    }

    const filteredPosts = posts.filter((post) => post.tags?.some((t) => slugifyTag(t) === tag));

    return (
        <main id="main-content" tabIndex={-1} className="outline-none">
            <section>
                <div className="container">
                    <div className="border-x border-primary/10">
                        <HardwareAnimated animation="slideInUp">
                            <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 pt-12 pb-8 gap-6">
                                <Breadcrumb
                                    backHref="/blog"
                                    backLabel="All Articles"
                                    items={[{ label: `Tag: ${originalTag}` }]}
                                />
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-primary mt-2 cursor-default">
                                        Articles tagged: <span className="font-semibold">{originalTag}</span>
                                    </h1>
                                </div>
                                <p className="text-secondary text-base leading-relaxed cursor-default">
                                    Showing {filteredPosts.length} article
                                    {filteredPosts.length !== 1 ? 's' : ''} related to {originalTag}.
                                </p>
                            </div>
                        </HardwareAnimated>

                        <div className="border-t border-primary/10">
                            <div className="max-w-3xl mx-auto px-4 sm:px-7 py-10 flex flex-col gap-8">
                                {filteredPosts.map((post, index) => (
                                    <HardwareAnimated key={post.slug} animation="slideInUp" delay={index * 0.08}>
                                        <article
                                            className={`group ${index !== filteredPosts.length - 1 ? 'border-b border-primary/15 pb-10' : ''}`}
                                        >
                                            <div className="flex items-center gap-3 text-xs font-mono text-secondary mb-3">
                                                <time dateTime={post.date} className="cursor-default">
                                                    {post.date}
                                                </time>
                                            </div>
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                                            >
                                                <h2 className="text-xl sm:text-2xl font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-3">
                                                    {post.title}
                                                </h2>
                                            </Link>
                                            <p className="text-secondary text-sm sm:text-base leading-relaxed mb-5 cursor-default">
                                                {post.excerpt}
                                            </p>

                                            <Link
                                                href={`/blog/${post.slug}`}
                                                aria-label={`Read article: ${post.title}`}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                                            >
                                                <span>Read Article</span>
                                                <Image
                                                    src="/images/icon/tile-arrow-icon.svg"
                                                    alt=""
                                                    aria-hidden="true"
                                                    width={20}
                                                    height={20}
                                                    style={{ width: 'auto', height: 'auto' }}
                                                    className="dark:invert group-hover:translate-x-1.5 group-hover:rotate-45 transition-all duration-300 ease-in"
                                                />
                                            </Link>
                                        </article>
                                    </HardwareAnimated>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
