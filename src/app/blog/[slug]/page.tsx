import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/mdx";
import { MDXContent } from "@/components/mdx-content";
import { Breadcrumb } from "@/components/breadcrumb";
import Divider from "../../components/divider";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.meta.metaTitle || post.meta.title,
    description: post.meta.metaDescription || post.meta.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.meta.metaTitle || post.meta.title,
      description: post.meta.metaDescription || post.meta.excerpt,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: post.meta.date,
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: Readonly<BlogPostPageProps>) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <main>
      <section>
        <div className="container">
          <div className="border-x border-primary/10">
            {/* Header / Meta */}
            <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-10 md:pt-14 pb-8 border-b border-primary/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <Breadcrumb
                  backHref="/blog"
                  backLabel="All Articles"
                  items={[{ label: post.meta.title }]}
                />
                <div className="text-sm text-secondary font-(family-name:--font-space-grotesk) flex items-center h-7.5">
                  {post.meta.date}
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-4 font-(family-name:--font-space-grotesk)">
                {post.meta.title}
              </h1>
              {post.meta.excerpt && (
                <p className="text-lg text-secondary leading-relaxed font-(family-name:--font-space-grotesk)">
                  {post.meta.excerpt}
                </p>
              )}
            </div>

            {/* Structured Article Body */}
            <div className="max-w-3xl mx-auto px-4 sm:px-7 pt-8 pb-10 md:pb-14">
              <MDXContent source={post.content} />
            </div>

            {/* Next / Previous Article Navigation */}
            <div className="max-w-3xl mx-auto px-4 sm:px-7 py-8 border-t border-primary/10 flex justify-between items-center gap-4 text-sm font-medium">
              <div className="flex-1 min-w-0">
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    aria-label={`Previous article: ${prevPost.title}`}
                    className="group flex flex-col gap-1 text-left text-primary hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    <span className="text-xs font-mono uppercase text-secondary shrink-0">
                      &larr; Previous Article
                    </span>
                    <span className="line-clamp-1" title={prevPost.title}>{prevPost.title}</span>
                  </Link>
                ) : (
                  <Link
                    href="/blog"
                    className="text-xs font-mono uppercase text-secondary hover:text-primary transition-colors shrink-0"
                  >
                    &larr; All Articles
                  </Link>
                )}
              </div>

              <div className="flex-1 min-w-0 text-right">
                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    aria-label={`Next article: ${nextPost.title}`}
                    className="group flex flex-col gap-1 text-right text-primary hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    <span className="text-xs font-mono uppercase text-secondary shrink-0">
                      Next Article &rarr;
                    </span>
                    <span className="line-clamp-1" title={nextPost.title}>{nextPost.title}</span>
                  </Link>
                ) : (
                  <Link
                    href="/blog"
                    className="text-xs font-mono uppercase text-secondary hover:text-primary transition-colors shrink-0"
                  >
                    All Articles &rarr;
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
