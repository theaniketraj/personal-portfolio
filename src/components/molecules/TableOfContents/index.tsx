import { slugify } from '@/utils/slugify';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents({ content }: { readonly content: string }) {
    const [activeId, setActiveId] = useState<string>('');
    const [headings, setHeadings] = useState<TOCItem[]>([]);

    useEffect(() => {
        if (!content) return;

        // Parse headings from markdown content
        // Handle both Unix (\n) and Windows (\r\n) line endings
        const lines = content.split(/\r?\n/);
        const extractedHeadings: TOCItem[] = [];

        // Regex to match # Heading or ## Heading
        // We only care about h2 and h3 for TOC
        const headingRegex = /^(#{2,3})\s+(.*)$/;

        for (const line of lines) {
            const match = headingRegex.exec(line);
            if (match) {
                const level = match[1].length;
                const rawText = match[2].trim();
                // Remove markdown formatting for display (bold, italic, code)
                const text = rawText.replaceAll(/[*_`]+/g, '');
                const id = slugify(rawText);
                extractedHeadings.push({ id, text, level });
            }
        }

        console.log('TOC Headings:', extractedHeadings);
        setHeadings(extractedHeadings);
    }, [content]);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }
            },
            { rootMargin: '-100px 0px -66% 0px' }
        );

        for (const heading of headings) {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        }

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className="hidden lg:block sticky top-32 self-start w-64 ml-8 p-4 border-l border-gray-200 dark:border-gray-800">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-500">On this page</h4>
            <ul className="space-y-2 text-sm">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        className={classNames({
                            'pl-0': heading.level === 2,
                            'pl-4': heading.level === 3
                        })}
                    >
                        <a
                            href={`#${heading.id}`}
                            className={classNames(
                                'block transition-colors duration-200 hover:text-[var(--theme-primary)]',
                                activeId === heading.id
                                    ? 'text-[var(--theme-primary)] font-medium'
                                    : 'text-gray-600 dark:text-gray-400'
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: 'smooth'
                                });
                                setActiveId(heading.id);
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
