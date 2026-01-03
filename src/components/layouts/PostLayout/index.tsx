import classNames from 'classnames';
import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';
import * as React from 'react';

import Breadcrumbs from '@/components/atoms/Breadcrumbs';
import Link from '@/components/atoms/Link';
import { DynamicComponent } from '@/components/components-registry';
import ReadingProgress from '@/components/molecules/ReadingProgress';
import TableOfContents from '@/components/molecules/TableOfContents';
import { PageComponentProps, PostLayout } from '@/types';
import HighlightedPreBlock from '@/utils/highlighted-markdown';
import { slugify } from '@/utils/slugify';
import BaseLayout from '../BaseLayout';

type NavigationPost = PostLayout & { slug: string };

type ComponentProps = PageComponentProps & PostLayout & {
    prevPost?: NavigationPost;
    nextPost?: NavigationPost;
};

const getTextFromChildren = (children: React.ReactNode): string => {
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return children.toString();
    if (Array.isArray(children)) return children.map(getTextFromChildren).join('');
    if (React.isValidElement(children)) {
        const props = children.props as { children?: React.ReactNode };
        if (props.children) {
            return getTextFromChildren(props.children);
        }
    }
    return '';
};

const Heading2 = ({ children, ...props }) => {
    const text = getTextFromChildren(children);
    const id = slugify(text);
    return (
        <h2 id={id} className="scroll-mt-24" {...props}>
            {children}
        </h2>
    );
};

const Heading3 = ({ children, ...props }) => {
    const text = getTextFromChildren(children);
    const id = slugify(text);
    return (
        <h3 id={id} className="scroll-mt-24" {...props}>
            {children}
        </h3>
    );
};

const Component: React.FC<ComponentProps> = (props) => {
    const { title, date, author, markdownContent, media, prevPost, nextPost, bottomSections = [] } = props;
    const dateTimeAttr = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    const formattedDate = dayjs(date).format('YYYY-MM-DD');

    return (
        <BaseLayout {...props}>
            <article className="px-4 py-14 lg:py-20">
                <div className="max-w-5xl mx-auto mb-8">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', url: '/' },
                            { label: 'Blog', url: '/blog' },
                            { label: title }
                        ]}
                    />
                </div>
                <ReadingProgress />
                <header className="max-w-5xl mx-auto mb-10 sm:mb-14 text-center">
                    <div className="mb-6 uppercase tracking-widest text-sm font-medium text-gray-500">
                        <time dateTime={dateTimeAttr}>{formattedDate}</time>
                        {author && (
                            <>
                                <span className="mx-2">•</span>
                                {author.firstName} {author.lastName}
                            </>
                        )}
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">{title}</h1>
                </header>
                {media && (
                    <figure className="max-w-6xl mx-auto mb-12 sm:mb-16 shadow-2xl rounded-2xl overflow-hidden">
                        <PostMedia media={media} />
                    </figure>
                )}

                <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[1fr_300px] gap-16 relative">
                    <div className="min-w-0">
                        {markdownContent && (
                            <Markdown
                                options={{
                                    forceBlock: true,
                                    overrides: {
                                        pre: HighlightedPreBlock,
                                        h2: Heading2,
                                        h3: Heading3
                                    }
                                }}
                                className="prose sm:prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-[var(--theme-primary)] hover:prose-a:text-[var(--theme-secondary)] transition-colors"
                            >
                                {markdownContent}
                            </Markdown>
                        )}
                    </div>
                    <aside className="hidden lg:block relative">
                        <div className="sticky top-32">
                            {markdownContent && <TableOfContents content={markdownContent} />}
                        </div>
                    </aside>
                </div>
            </article>
            {(prevPost || nextPost) && (
                <nav className="px-4 mt-12 mb-20">
                    <div className="flex flex-col max-w-4xl mx-auto border-t border-gray-200 dark:border-gray-800">
                        {prevPost && (
                            <Link
                                className="group flex flex-col items-start w-full px-6 py-6 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                href={'/blog/' + prevPost.slug}
                            >
                                <span className="text-xs font-medium tracking-widest text-gray-500 uppercase mb-1">Previous Post</span>
                                <span className="text-lg font-bold leading-tight group-hover:text-[var(--theme-primary)] transition-colors">
                                    {prevPost.title}
                                </span>
                            </Link>
                        )}
                        {nextPost && (
                            <Link
                                className="group flex flex-col items-end w-full px-6 py-6 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors text-right"
                                href={'/blog/' + nextPost.slug}
                            >
                                <span className="text-xs font-medium tracking-widest text-gray-500 uppercase mb-1">Next Post</span>
                                <span className="text-lg font-bold leading-tight group-hover:text-[var(--theme-primary)] transition-colors">
                                    {nextPost.title}
                                </span>
                            </Link>
                        )}
                    </div>
                </nav>
            )}
            {bottomSections?.map((section, index) => {
                return <DynamicComponent key={index} {...section} />;
            })}
        </BaseLayout>
    );
};
export default Component;

function PostMedia({ media }) {
    return <DynamicComponent {...media} className={classNames({ 'w-full': media.type === 'ImageBlock' })} />;
}
