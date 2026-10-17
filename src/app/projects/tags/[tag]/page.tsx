import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getProjects, slugifyTag } from '@/lib/mdx';
import { HardwareAnimated } from '@/components/animations/hardware-animated';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/breadcrumb';

export async function generateStaticParams() {
    await Promise.resolve();
    const projects = getProjects();
    const allTags = new Set<string>();
    projects.forEach((project) => {
        project.tags?.forEach((tag) => {
            allTags.add(slugifyTag(tag));
        });
    });
    return Array.from(allTags).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
    const { tag } = await params;
    const projects = getProjects();
    const originalTag = projects.flatMap((p) => p.tags || []).find((t) => slugifyTag(t) === tag);
    return {
        title: `Projects tagged with "${originalTag || tag.replaceAll('-', ' ')}"`,
        robots: {
            index: false,
            follow: true
        }
    };
}

export default async function ProjectTagPage({
    params
}: Readonly<{
    params: Promise<{ tag: string }>;
}>) {
    const { tag } = await params;
    const projects = getProjects();

    const originalTag = projects.flatMap((p) => p.tags || []).find((t) => slugifyTag(t) === tag);

    if (!originalTag) {
        notFound();
    }

    const filteredProjects = projects.filter((project) =>
        project.tags?.some((t) => slugifyTag(t) === tag)
    );

    return (
        <main>
            <section>
                <div className="container">
                    <div className="border-x border-primary/10">
                        <HardwareAnimated animation="slideInUp">
                            <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 pt-12 pb-8 gap-6">
                                <Breadcrumb
                                    backHref="/projects"
                                    backLabel="All Projects"
                                    items={[{ label: `Tag: ${originalTag}` }]}
                                />
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-primary mt-2 cursor-default">
                                        Projects tagged: <span className="font-semibold">{originalTag}</span>
                                    </h1>
                                </div>
                                <p className="text-secondary text-base leading-relaxed cursor-default">
                                    Showing {filteredProjects.length} project
                                    {filteredProjects.length !== 1 ? 's' : ''} related to {originalTag}.
                                </p>
                            </div>
                        </HardwareAnimated>

                        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-primary/10">
                            {filteredProjects.map((project, index) => {
                                const isRightCol = index % 2 === 1;
                                return (
                                    <HardwareAnimated key={project.slug} animation="fadeInScale" delay={index * 0.1}>
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
                                                <Link href={`/projects/${project.slug}`}>
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
                                                    className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mt-auto"
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
                    </div>
                </div>
            </section>
        </main>
    );
}
