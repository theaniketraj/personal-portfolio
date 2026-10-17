import React from 'react';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { MdxPre } from './mdx-pre';
import { TLDR } from './mdx-callout';
import { ArrowUpRight } from 'lucide-react';
import { ParagraphHighlighter } from './paragraph-highlighter';

const components: MDXRemoteProps['components'] = {
    TLDR,
    h1: (props: React.ComponentProps<'h1'>) => (
        <h1
            {...props}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mt-8 mb-4 tracking-tight border-b border-primary/10 pb-3 cursor-default"
        >
            {props.children}
        </h1>
    ),
    h2: (props: React.ComponentProps<'h2'>) => {
        const isGoTo = typeof props.children === 'string' && props.children.toLowerCase().includes('go-to');
        if (isGoTo) {
            return (
                <h2
                    {...props}
                    className="text-xl sm:text-2xl font-semibold text-primary mt-10 mb-4 tracking-tight border-b border-primary/10 pb-2 flex items-center gap-2 cursor-default"
                >
                    <span>Project Resources</span>
                </h2>
            );
        }
        return (
            <h2
                {...props}
                className="text-xl sm:text-2xl font-semibold text-primary mt-8 mb-4 tracking-tight border-b border-primary/10 pb-2 cursor-default"
            >
                {props.children}
            </h2>
        );
    },
    h3: (props: React.ComponentProps<'h3'>) => (
        <h3 {...props} className="text-lg sm:text-xl font-medium text-primary mt-6 mb-3 cursor-default">
            {props.children}
        </h3>
    ),
    h4: (props: React.ComponentProps<'h4'>) => (
        <h4 {...props} className="text-base sm:text-lg font-medium text-primary mt-4 mb-2 cursor-default">
            {props.children}
        </h4>
    ),
    p: (props: React.ComponentProps<'p'>) => (
        <p
            {...props}
            className="text-base font-normal text-secondary leading-relaxed mb-4 last:mb-0 empty:hidden cursor-default"
        />
    ),
    strong: (props: React.ComponentProps<'strong'>) => (
        <strong {...props} className="font-semibold text-primary cursor-default" />
    ),
    b: (props: React.ComponentProps<'b'>) => <b {...props} className="font-semibold text-primary cursor-default" />,
    em: (props: React.ComponentProps<'em'>) => <em {...props} className="italic text-primary/90 cursor-default" />,
    ul: (props: React.ComponentProps<'ul'>) => (
        <ul {...props} className="list-disc list-outside space-y-2 mb-6 ml-6 text-secondary cursor-default" />
    ),
    ol: (props: React.ComponentProps<'ol'>) => (
        <ol {...props} className="list-decimal list-outside space-y-2 mb-6 ml-6 text-secondary cursor-default" />
    ),
    li: (props: React.ComponentProps<'li'>) => (
        <li {...props} className="text-base font-normal leading-relaxed text-secondary pl-2 cursor-default" />
    ),
    blockquote: (props: React.ComponentProps<'blockquote'>) => (
        <blockquote
            {...props}
            className="border-l-4 border-primary/30 pl-4 py-2 my-6 italic text-secondary bg-primary/5 rounded-r-lg cursor-default"
        />
    ),
    figure: (props: React.ComponentProps<'figure'>) => (
        <figure {...props} className="my-6 relative w-full cursor-default" />
    ),
    pre: MdxPre,
    code: (props: React.ComponentProps<'code'>) => {
        if (props.className) {
            return <code {...props} />;
        }
        return (
            <code
                {...props}
                className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono cursor-default"
            />
        );
    },
    table: (props: React.ComponentProps<'table'>) => (
        <div className="my-6 cursor-default">
            <div className="overflow-x-auto border border-primary/10 rounded-xl">
                <table {...props} className="w-full text-left border-collapse text-sm cursor-default" />
            </div>
        </div>
    ),
    th: (props: React.ComponentProps<'th'>) => (
        <th
            {...props}
            className="bg-primary/5 text-primary font-semibold p-3 border-b border-primary/10 tracking-wider text-sm cursor-default"
        />
    ),
    td: (props: React.ComponentProps<'td'>) => (
        <td {...props} className="p-3 border-b border-primary/10 text-secondary cursor-default" />
    ),
    a: ({ href, children, ...props }: React.ComponentProps<'a'>) => {
        const isInternal = href && (href.startsWith('/') || href.startsWith('#'));
        const textStr = typeof children === 'string' ? children : '';

        // Check if it's a Go-To action link button
        const isButtonLink =
            textStr.includes('↗') ||
            textStr.includes('→') ||
            textStr.toLowerCase().includes('repo') ||
            textStr.toLowerCase().includes('portal') ||
            textStr.toLowerCase().includes('docs');

        if (isButtonLink) {
            const cleanText = textStr.replace(/[↗→]/g, '').trim();
            return (
                <a
                    href={href}
                    target={isInternal ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    {...props}
                    className="group inline-block p-0.5 my-1 rounded-full bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)] no-underline transition-all duration-300 hover:shadow-[0_0_16px_rgba(146,130,248,0.35)] cursor-pointer"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background group-hover:bg-transparent text-primary group-hover:text-zinc-950 font-medium text-sm transition-all duration-300">
                        <span>{cleanText}</span>
                        <span className="relative flex items-center justify-center overflow-hidden w-4 h-4">
                            <ArrowUpRight className="absolute w-4 h-4 transition-transform duration-300 group-hover:translate-x-full group-hover:-translate-y-full" />
                            <ArrowUpRight className="absolute w-4 h-4 -translate-x-full translate-y-full transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                        </span>
                    </span>
                </a>
            );
        }

        if (isInternal) {
            return (
                <Link
                    href={href}
                    {...props}
                    className="font-medium text-primary hover:text-violet-600 dark:hover:text-violet-400 gradient-underline transition-colors duration-200 cursor-pointer"
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
                className="group font-medium text-primary hover:text-violet-600 dark:hover:text-violet-400 gradient-underline transition-colors duration-200 cursor-pointer"
            >
                <span>{children}</span>
            </a>
        );
    },
    hr: (props: React.ComponentProps<'hr'>) => <hr {...props} className="my-8 border-primary/10" />
};

interface MDXContentProps {
    source: string;
}

export function MDXContent({ source }: Readonly<MDXContentProps>) {
    return (
        <div className="mdx-content cursor-default font-(family-name:--font-space-grotesk)">
            <ParagraphHighlighter>
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
                                            light: 'github-light',
                                            dark: 'github-dark'
                                        },
                                        keepBackground: false
                                    }
                                ]
                            ]
                        }
                    }}
                />
            </ParagraphHighlighter>
        </div>
    );
}
