import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { MdxPre } from "./mdx-pre";

const components = {
  h1: (props: any) => (
    <h1
      {...props}
      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mt-8 mb-4 tracking-tight border-b border-primary/10 pb-3"
    />
  ),
  h2: (props: any) => {
    const isGoTo =
      typeof props.children === "string" &&
      props.children.toLowerCase().includes("go-to");
    if (isGoTo) {
      return (
        <h2
          {...props}
          className="text-xl sm:text-2xl font-semibold text-primary mt-10 mb-4 tracking-tight border-b border-primary/10 pb-2 flex items-center gap-2"
        >
          <span>Project Resources</span>
        </h2>
      );
    }
    return (
      <h2
        {...props}
        className="text-xl sm:text-2xl font-semibold text-primary mt-8 mb-4 tracking-tight border-b border-primary/10 pb-2"
      />
    );
  },
  h3: (props: any) => (
    <h3
      {...props}
      className="text-lg sm:text-xl font-medium text-primary mt-6 mb-3"
    />
  ),
  h4: (props: any) => (
    <h4
      {...props}
      className="text-base sm:text-lg font-medium text-primary mt-4 mb-2"
    />
  ),
  p: (props: any) => (
    <p
      {...props}
      className="text-base font-normal text-secondary leading-relaxed mb-4 last:mb-0 empty:hidden"
    />
  ),
  strong: (props: any) => (
    <strong {...props} className="font-semibold text-primary" />
  ),
  b: (props: any) => <b {...props} className="font-semibold text-primary" />,
  em: (props: any) => <em {...props} className="italic text-primary/90" />,
  ul: (props: any) => (
    <ul
      {...props}
      className="list-disc list-outside space-y-2 mb-6 ml-6 text-secondary"
    />
  ),
  ol: (props: any) => (
    <ol
      {...props}
      className="list-decimal list-outside space-y-2 mb-6 ml-6 text-secondary"
    />
  ),
  li: (props: any) => (
    <li
      {...props}
      className="text-base font-normal leading-relaxed text-secondary pl-2"
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      {...props}
      className="border-l-4 border-primary/30 pl-4 py-2 my-6 italic text-secondary bg-primary/5 rounded-r-lg"
    />
  ),
  figure: (props: any) => (
    <figure {...props} className="my-6 relative w-full" />
  ),
  pre: MdxPre,
  code: (props: any) => {
    if (props.className) {
      return <code {...props} />;
    }
    return (
      <code
        {...props}
        className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono"
      />
    );
  },
  table: (props: any) => (
    <div className="my-6">
      <div className="overflow-x-auto border border-primary/10 rounded-xl">
        <table
          {...props}
          className="w-full text-left border-collapse text-sm"
        />
      </div>
    </div>
  ),
  th: (props: any) => (
    <th
      {...props}
      className="bg-primary/5 text-primary font-semibold p-3 border-b border-primary/10 tracking-wider text-sm"
    />
  ),
  td: (props: any) => (
    <td {...props} className="p-3 border-b border-primary/10 text-secondary" />
  ),
  a: ({ href, children, ...props }: any) => {
    const isInternal = href && (href.startsWith("/") || href.startsWith("#"));
    const textStr = typeof children === "string" ? children : "";

    // Check if it's a Go-To action link button
    const isButtonLink =
      textStr.includes("↗") ||
      textStr.includes("→") ||
      textStr.toLowerCase().includes("repo") ||
      textStr.toLowerCase().includes("portal") ||
      textStr.toLowerCase().includes("docs");

    if (isButtonLink) {
      const cleanText = textStr.replace(/[↗→]/g, "").trim();
      return (
        <a
          href={href}
          target={isInternal ? "_self" : "_blank"}
          rel="noopener noreferrer"
          {...props}
          className="inline-flex items-center gap-2 px-4 py-2 my-1 rounded-full border border-primary/20 bg-primary/5 hover:bg-violet-600 dark:hover:bg-violet-500 text-primary hover:text-white font-medium text-sm transition-all duration-200 shadow-xs no-underline group"
        >
          <span>{cleanText}</span>
          <Image
            src="/images/icon/tile-arrow-icon.svg"
            alt="arrow"
            width={16}
            height={16}
            className="dark:invert group-hover:invert group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
          />
        </a>
      );
    }

    if (isInternal) {
      return (
        <Link
          href={href}
          {...props}
          className="text-primary underline font-medium hover:opacity-80 transition-opacity"
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
        className="text-primary underline font-medium hover:opacity-80 transition-opacity"
      >
        {children}
      </a>
    );
  },
  hr: (props: any) => <hr {...props} className="my-8 border-primary/10" />,
};

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: Readonly<MDXContentProps>) {
  return (
    <div className="mdx-content font-(family-name:--font-space-grotesk)">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypePrettyCode,
                {
                  theme: {
                    light: "github-light",
                    dark: "github-dark",
                  },
                  keepBackground: true,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
