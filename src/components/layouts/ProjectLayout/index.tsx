import classNames from 'classnames';
import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';
import * as React from 'react';

import Breadcrumbs from '@/components/atoms/Breadcrumbs';
import Link from '@/components/atoms/Link';
import { DynamicComponent } from '@/components/components-registry';
import ImageBlock from '@/components/molecules/ImageBlock';
import TableOfContents from '@/components/molecules/TableOfContents';
import { PageComponentProps, ProjectLayout } from '@/types';
import HighlightedPreBlock from '@/utils/highlighted-markdown';
import { slugify } from '@/utils/slugify';
import BaseLayout from '../BaseLayout';

type NavigationProject = ProjectLayout & { slug: string };

type ComponentProps = PageComponentProps &
    ProjectLayout & {
        prevProject?: NavigationProject;
        nextProject?: NavigationProject;
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

const CustomLink = ({ children, href, className, ...props }) => {
    const text = getTextFromChildren(children);
    const isGoTo = text.includes('↗');

    if (isGoTo) {
        return (
            <span className="not-prose">
                <a
                    href={href}
                    className={classNames('btn-goto', className)}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                >
                    {children}
                </a>
            </span>
        );
    }
    return (
        <a href={href} className={className} {...props}>
            {children}
        </a>
    );
};

const Component: React.FC<ComponentProps> = (props) => {
    const {
        title,
        date,
        client,
        description,
        markdownContent,
        media,
        prevProject,
        nextProject,
        bottomSections = []
    } = props;
    const dateTimeAttr = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    const formattedDate = dayjs(date).format('YYYY-MM-DD');

    return (
        <BaseLayout {...props}>
            <article className="px-4 py-14 lg:py-20">
                <div className="max-w-5xl mx-auto mb-8">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', url: '/' },
                            { label: 'Projects', url: '/projects' },
                            { label: title }
                        ]}
                    />
                </div>
                <header className="max-w-5xl mx-auto mb-10 sm:mb-14">
                    {client && <div className="text-lg uppercase md:mb-6">{client}</div>}
                    <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                        <time className="text-lg md:order-last" dateTime={dateTimeAttr}>
                            {formattedDate}
                        </time>
                        <h1 className="text-5xl sm:text-6xl md:max-w-2xl md:grow">{title}</h1>
                    </div>
                </header>
                {description && (
                    <div className="max-w-3xl mx-auto mb-10 text-lg uppercase sm:text-xl sm:mb-14">{description}</div>
                )}
                {media && (
                    <figure className="max-w-5xl mx-auto mb-10 sm:mb-14">
                        <ProjectMedia media={media} />
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
                                        h3: Heading3,
                                        a: CustomLink
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
            {(prevProject || nextProject) && (
                <nav className="px-4 mt-12 mb-20">
                    <div className="flex flex-col max-w-4xl mx-auto border-t border-gray-200 dark:border-gray-800">
                        {prevProject && (
                            <Link
                                className="group flex flex-col items-start w-full px-6 py-8 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                href={'/projects/' + prevProject.slug}
                            >
                                <span className="text-xs font-medium tracking-widest text-gray-500 uppercase mb-2">Previous Project</span>
                                <div className="flex items-center gap-4 w-full">
                                    {prevProject.featuredImage && (
                                        <div className="hidden sm:block w-20 h-14 shrink-0 overflow-hidden rounded">
                                            <ImageBlock
                                                {...prevProject.featuredImage}
                                                className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                        </div>
                                    )}
                                    <span className="text-xl font-bold leading-tight uppercase transition-colors group-hover:text-[var(--theme-primary)]">
                                        {prevProject.title}
                                    </span>
                                </div>
                            </Link>
                        )}
                        {nextProject && (
                            <Link
                                className="group flex flex-col items-end w-full px-6 py-8 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors text-right"
                                href={'/projects/' + nextProject.slug}
                            >
                                <span className="text-xs font-medium tracking-widest text-gray-500 uppercase mb-2">Next Project</span>
                                <div className="flex flex-row-reverse items-center gap-4 w-full">
                                    {nextProject.featuredImage && (
                                        <div className="hidden sm:block w-20 h-14 shrink-0 overflow-hidden rounded">
                                            <ImageBlock
                                                {...nextProject.featuredImage}
                                                className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                        </div>
                                    )}
                                    <span className="text-xl font-bold leading-tight uppercase transition-colors group-hover:text-[var(--theme-primary)]">
                                        {nextProject.title}
                                    </span>
                                </div>
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

function ProjectMedia({ media }) {
    return <DynamicComponent {...media} className={classNames({ 'w-full': media.type === 'ImageBlock' })} />;
}
