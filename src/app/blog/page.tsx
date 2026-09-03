import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/mdx";
import { HardwareAnimated } from "@/components/animations/hardware-animated";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Technical Writing",
  description:
    "Articles, architecture deep dives, and zero-fluff engineering guides by Aniket Raj.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main>
      <section>
        <div className="container">
          <div className="border-x border-primary/10">
            <HardwareAnimated animation="slideInUp">
              <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 py-12 md:py-16 gap-6">
                <div>
                  <p className="text-sm tracking-[2px] text-primary uppercase font-medium mb-2">
                    Writing &amp; Insights
                  </p>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-primary">
                    Technical Blog &amp; Engineering Guides
                  </h1>
                </div>
                <p className="text-secondary text-base leading-relaxed">
                  In-depth articles covering Kotlin architecture, AI
                  transformers, CI/CD, web performance, and software security.
                </p>
              </div>
            </HardwareAnimated>

            <div className="border-t border-primary/10">
              <div className="max-w-3xl mx-auto px-4 sm:px-7 py-10 flex flex-col gap-8">
                {posts.map((post, index) => (
                  <HardwareAnimated
                    key={post.slug}
                    animation="slideInUp"
                    delay={index * 0.08}
                  >
                    <article
                      className={`group ${index !== posts.length - 1 ? "border-b border-primary/15 pb-10" : ""}`}
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
