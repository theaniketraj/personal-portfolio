import { slugify } from '@/utils/slugify';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents({ content }: { readonly content: string }) {
    const [activeId, setActiveId] = useState<string>('');
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (!content) return;

        // Parse headings from markdown content
        const lines = content.split(/\r?\n/);
        const extractedHeadings: TOCItem[] = [];
        const headingRegex = /^(#{2,3})\s+(.*)$/;

        for (const line of lines) {
            const match = headingRegex.exec(line);
            if (match) {
                const level = match[1].length;
                const rawText = match[2].trim();
                const text = rawText.replaceAll(/[*_`]+/g, '');
                const id = slugify(rawText);
                extractedHeadings.push({ id, text, level });
            }
        }

        setHeadings(extractedHeadings);
    }, [content]);

    useEffect(() => {
        if (headings.length === 0) return;

        const headingElements = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];

        // Use a Map to track visibility of all headings
        const visibilityMap = new Map<string, boolean>();

        const callback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                visibilityMap.set(entry.target.id, entry.isIntersecting);
            });

            // Find the first visible header
            const visibleId = headings.find((h) => visibilityMap.get(h.id))?.id;

            if (visibleId) {
                setActiveId(visibleId);
            }
        };

        // Root margin triggers intersection when header is near the top of viewport
        observerRef.current = new IntersectionObserver(callback, {
            rootMargin: '-80px 0px -80% 0px',
            threshold: 0
        });

        headingElements.forEach((el) => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, [headings]);

    const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // Update active state immediately
            setActiveId(id);
            // Smooth scroll with offset for header
            window.scrollTo({
                top: element.offsetTop - 100, // 100px offset for fixed header
                behavior: 'smooth'
            });
            // Update URL hash without jumping
            history.pushState(null, '', `#${id}`);
        }
    };

    if (headings.length === 0) return null;

    return (
        <nav className="hidden lg:block sticky top-32 w-64 ml-8">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-500 dark:text-gray-400">
                On this page
            </h4>
            <div className="relative border-l border-gray-200 dark:border-gray-800">
                <ul className="text-sm">
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            className={classNames('relative', {
                                'pl-4': heading.level === 2,
                                'pl-8': heading.level === 3
                            })}
                        >
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => handleScrollTo(e, heading.id)}
                                className={classNames(
                                    'block py-2 transition-colors duration-200 relative z-10',
                                    activeId === heading.id
                                        ? 'text-[var(--theme-primary)] font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                )}
                            >
                                {heading.text}
                            </a>
                            {/* Animated Active Indicator */}
                            {activeId === heading.id && (
                                <motion.div
                                    layoutId="toc-active-indicator"
                                    className="absolute left-0 top-0 bottom-0 -ml-[1px] w-[2px] bg-[var(--theme-primary)]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
