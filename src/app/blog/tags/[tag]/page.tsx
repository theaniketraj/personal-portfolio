import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/mdx";
import { HardwareAnimated } from "@/components/animations/hardware-animated";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  const allTags = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      allTags.add(tag.toLowerCase().replace(/\s+/g, "-"));
    });
  });
  return Array.from(allTags).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return {
    title: `Articles tagged with "${tag.replaceAll("-", " ")}"`,
  };
}

export default async function BlogTagPage({
  params,
}: Readonly<{
  params: Promise<{ tag: string }>;
}>) {
  const { tag } = await params;
  const posts = getBlogPosts();

  const originalTag = posts
    .flatMap((p) => p.tags || [])
    .find((t) => t.toLowerCase().replace(/\s+/g, "-") === tag);

  if (!originalTag) {
    notFound();
  }

  const filteredPosts = posts.filter((post) =>
    post.tags?.some((t) => t.toLowerCase().replace(/\s+/g, "-") === tag),
  );

  return (
    <main>
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
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-primary mt-2">
                    Articles tagged:{" "}
                    <span className="font-semibold">{originalTag}</span>
                  </h1>
                </div>
                <p className="text-secondary text-base leading-relaxed">
                  Showing {filteredPosts.length} article
                  {filteredPosts.length !== 1 ? "s" : ""} related to{" "}
                  {originalTag}.
                </p>
              </div>
            </HardwareAnimated>

            <div className="border-t border-primary/10">
              <div className="max-w-3xl mx-auto px-4 sm:px-7 py-10 flex flex-col gap-8">
                {filteredPosts.map((post, index) => (
                  <HardwareAnimated
                    key={post.slug}
                    animation="slideInUp"
                    delay={index * 0.08}
                  >
                    <article
                      className={`group ${index !== filteredPosts.length - 1 ? "border-b border-primary/15 pb-10" : ""}`}
                    >
                      <div className="flex items-center gap-3 text-xs font-mono text-secondary mb-3">
                        <time dateTime={post.date}>{post.date}</time>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-xl sm:text-2xl font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-3">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-secondary text-sm sm:text-base leading-relaxed mb-5">
                        {post.excerpt}
                      </p>

                      <Link
                        href={`/blog/${post.slug}`}
                        aria-label={`Read article: ${post.title}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                      >
                        <span>Read Article</span>
                        <Image
                          src="/images/icon/tile-arrow-icon.svg"
                          alt=""
                          aria-hidden="true"
                          width={20}
                          height={20}
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
