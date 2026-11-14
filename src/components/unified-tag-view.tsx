import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumb } from '@/components/breadcrumb';
import { HardwareAnimated } from '@/components/animations/hardware-animated';
import { ProjectMeta, BlogPostMeta } from '@/lib/content/types';

interface UnifiedTagViewProps {
    originalTag: string;
    tagSlug: string;
    projects: ProjectMeta[];
    posts: BlogPostMeta[];
}

export function UnifiedTagView({ originalTag, projects, posts }: Readonly<UnifiedTagViewProps>) {
    const hasProjects = projects.length > 0;
    const hasPosts = posts.length > 0;

    let backHref = '/blog';
    let backLabel = 'All Articles';

    if (hasProjects && hasPosts) {
        backHref = '/';
        backLabel = 'Home';
    } else if (hasProjects) {
        backHref = '/projects';
        backLabel = 'All Projects';
    }

    const getHeadingText = () => {
        if (hasProjects && hasPosts) {
            return (
                <>
                    Content tagged: <span className="font-semibold">{originalTag}</span>
                </>
            );
        }
        if (hasProjects) {
            return (
                <>
                    Projects tagged: <span className="font-semibold">{originalTag}</span>
                </>
            );
        }
        return (
            <>
                Articles tagged: <span className="font-semibold">{originalTag}</span>
            </>
        );
    };

    const getDescriptionText = () => {
        if (hasProjects && hasPosts) {
            return `Showing ${posts.length} article${posts.length !== 1 ? 's' : ''} and ${projects.length} project${projects.length !== 1 ? 's' : ''} related to ${originalTag}.`;
        }
        if (hasProjects) {
            return `Showing ${projects.length} project${projects.length !== 1 ? 's' : ''} related to ${originalTag}.`;
        }
        return `Showing ${posts.length} article${posts.length !== 1 ? 's' : ''} related to ${originalTag}.`;
    };

    const getEyebrowText = () => {
        if (hasProjects && hasPosts) {
            return 'Writing & Projects';
        }
        if (hasProjects) {
            return 'Project Tag';
        }
        return 'Technical Writing';
    };

    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        >
            <section>
                <div className="container">
                    <div className="border-x border-primary/10">
                        {/* Hero Header */}
                        <HardwareAnimated animation="slideInUp">
                            <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 pt-12 pb-8 gap-6">
                                <Breadcrumb
                                    backHref={backHref}
                                    backLabel={backLabel}
                                    items={[{ label: `Tag: ${originalTag}` }]}
                                />
                                <div>
                                    <p className="text-sm tracking-[2px] text-primary uppercase cursor-default select-none font-medium mb-2 font-(family-name:--font-space-grotesk)">
                                        {getEyebrowText()}
                                    </p>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-primary mt-1 cursor-default font-(family-name:--font-space-grotesk)">
                                        {getHeadingText()}
                                    </h1>
                                </div>
                                <p className="text-secondary text-base leading-relaxed cursor-default">
                                    {getDescriptionText()}
                                </p>
                            </div>
                        </HardwareAnimated>

                        {/* CASE 1: BOTH Projects and Articles */}
                        {hasProjects && hasPosts && (
                            <>
                                {/* Articles Section */}
                                <section
                                    aria-labelledby="tagged-articles-heading"
                                    className="border-t border-primary/10"
                                >
                                    <div className="max-w-3xl mx-auto px-4 sm:px-7 py-8 sm:py-10 flex items-center gap-2.5">
                                        <h2
                                            id="tagged-articles-heading"
                                            className="text-xl sm:text-2xl font-normal text-primary font-(family-name:--font-space-grotesk)"
                                        >
                                            Technical Writing &amp; Guides
                                        </h2>
                                        <span className="text-xs font-mono text-secondary border border-primary/10 rounded-md px-2 py-0.5 cursor-default">
                                            {posts.length}
                                        </span>
                                    </div>

                                    <div className="border-t border-primary/10">
                                        <div className="max-w-3xl mx-auto px-4 sm:px-7 py-10 flex flex-col gap-8">
                                            {posts.map((post, index) => (
                                                <HardwareAnimated
                                                    key={post.slug}
                                                    animation="slideInUp"
                                                    delay={index * 0.08}
                                                >
                                                    <article
                                                        className={`group ${
                                                            index !== posts.length - 1
                                                                ? 'border-b border-primary/15 pb-10'
                                                                : ''
                                                        }`}
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
                                                            <h3 className="text-xl sm:text-2xl font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-3">
                                                                {post.title}
                                                            </h3>
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
                                </section>

                                {/* Projects Section */}
                                <section
                                    aria-labelledby="tagged-projects-heading"
                                    className="border-t border-primary/10"
                                >
                                    <div className="max-w-3xl mx-auto px-4 sm:px-7 py-8 sm:py-10 flex items-center gap-2.5">
                                        <h2
                                            id="tagged-projects-heading"
                                            className="text-xl sm:text-2xl font-normal text-primary font-(family-name:--font-space-grotesk)"
                                        >
                                            Projects
                                        </h2>
                                        <span className="text-xs font-mono text-secondary border border-primary/10 rounded-md px-2 py-0.5 cursor-default">
                                            {projects.length}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-primary/10">
                                        {projects.map((project, index) => {
                                            const isRightCol = index % 2 === 1;
                                            return (
                                                <HardwareAnimated
                                                    key={project.slug}
                                                    animation="fadeInScale"
                                                    delay={index * 0.08}
                                                >
                                                    <div
                                                        className={`group flex flex-col justify-between p-6 sm:p-8 ${
                                                            isRightCol ? 'md:border-l md:border-primary/10' : ''
                                                        } border-b border-primary/10 hover:bg-primary/5 transition-colors h-full`}
                                                    >
                                                        <div className="flex flex-col gap-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-mono text-secondary border border-primary/10 rounded-md px-2.5 py-0.5 cursor-default">
                                                                    {project.date}
                                                                </span>
                                                            </div>
                                                            <Link
                                                                href={`/projects/${project.slug}`}
                                                                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                                                            >
                                                                <h3 className="text-xl font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                                    {project.title}
                                                                </h3>
                                                            </Link>
                                                            <p className="text-sm text-secondary line-clamp-3 cursor-default">
                                                                {project.description}
                                                            </p>
                                                        </div>

                                                        <div className="pt-5 flex flex-col gap-5">
                                                            <Link
                                                                href={`/projects/${project.slug}`}
                                                                aria-label={`View case study: ${project.title}`}
                                                                className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mt-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                                                            >
                                                                <span>View Case Study / Docs</span>
                                                                <Image
                                                                    src="/images/icon/tile-arrow-icon.svg"
                                                                    alt=""
                                                                    aria-hidden="true"
                                                                    width={20}
                                                                    height={20}
                                                                    priority={index < 4}
                                                                    style={{ width: 'auto', height: 'auto' }}
                                                                    className="dark:invert group-hover:translate-x-1.5 group-hover:rotate-45 transition-all duration-300 ease-in"
                                                                />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </HardwareAnimated>
                                            );
                                        })}
                                    </div>
                                </section>
                            </>
                        )}

                        {/* CASE 2: ONLY Projects */}
                        {hasProjects && !hasPosts && (
                            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-primary/10">
                                {projects.map((project, index) => {
                                    const isRightCol = index % 2 === 1;
                                    return (
                                        <HardwareAnimated
                                            key={project.slug}
                                            animation="fadeInScale"
                                            delay={index * 0.1}
                                        >
                                            <div
                                                className={`group flex flex-col justify-between p-6 sm:p-8 ${
                                                    isRightCol ? 'md:border-l md:border-primary/10' : ''
                                                } border-b border-primary/10 hover:bg-primary/5 transition-colors h-full`}
                                            >
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-mono text-secondary border border-primary/10 rounded-md px-2.5 py-0.5 cursor-default">
                                                            {project.date}
                                                        </span>
                                                    </div>
                                                    <Link
                                                        href={`/projects/${project.slug}`}
                                                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                                                    >
                                                        <h2 className="text-xl font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                            {project.title}
                                                        </h2>
                                                    </Link>
                                                    <p className="text-sm text-secondary line-clamp-3 cursor-default">
                                                        {project.description}
                                                    </p>
                                                </div>

                                                <div className="pt-5 flex flex-col gap-5">
                                                    <Link
                                                        href={`/projects/${project.slug}`}
                                                        aria-label={`View case study: ${project.title}`}
                                                        className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mt-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                                                    >
                                                        <span>View Case Study / Docs</span>
                                                        <Image
                                                            src="/images/icon/tile-arrow-icon.svg"
                                                            alt=""
                                                            aria-hidden="true"
                                                            width={20}
                                                            height={20}
                                                            priority={index < 4}
                                                            style={{ width: 'auto', height: 'auto' }}
                                                            className="dark:invert group-hover:translate-x-1.5 group-hover:rotate-45 transition-all duration-300 ease-in"
                                                        />
                                                    </Link>
                                                </div>
                                            </div>
                                        </HardwareAnimated>
                                    );
                                })}
                            </div>
                        )}

                        {/* CASE 3: ONLY Articles */}
                        {!hasProjects && hasPosts && (
                            <div className="border-t border-primary/10">
                                <div className="max-w-3xl mx-auto px-4 sm:px-7 py-10 flex flex-col gap-8">
                                    {posts.map((post, index) => (
                                        <HardwareAnimated key={post.slug} animation="slideInUp" delay={index * 0.08}>
                                            <article
                                                className={`group ${
                                                    index !== posts.length - 1 ? 'border-b border-primary/15 pb-10' : ''
                                                }`}
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
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
