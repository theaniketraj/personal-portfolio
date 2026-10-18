'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Heading } from '@/lib/toc';

interface TableOfContentsProps {
    headings: Heading[];
}

export function TableOfContents({ headings }: Readonly<TableOfContentsProps>) {
    const [activeId, setActiveId] = useState<string>('');
    const [isNearBottom, setIsNearBottom] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (headings.length === 0) return;

        // Use IntersectionObserver directly on the known IDs
        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: '-20% 0px -80% 0px'
        });

        headings.forEach((heading) => {
            const elem = document.getElementById(heading.id);
            if (elem) observer.observe(elem);
        });

        if (!window.location.hash) {
            setActiveId(headings[0].id);
        }

        return () => observer.disconnect();
    }, [headings]);

    // Auto-scroll the TOC container so the active item is always visible
    useEffect(() => {
        if (activeId && navRef.current) {
            const activeLink = document.getElementById(`toc-link-${activeId}`);
            if (activeLink) {
                const nav = navRef.current;
                const navRect = nav.getBoundingClientRect();
                const linkRect = activeLink.getBoundingClientRect();
                // Calculate the relative offset to center the item within the nav container
                const offset = linkRect.top - navRect.top - navRect.height / 2 + linkRect.height / 2;

                nav.scrollBy({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        }
    }, [activeId]);

    // Fade out TOC when reaching the footer
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            // 300px keeps it visible through the resources section and fades out near the Next/Prev buttons
            if (documentHeight - scrollPosition < 300) {
                setIsNearBottom(true);
            } else {
                setIsNearBottom(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (headings.length === 0) return null;

    return (
        <nav
            ref={navRef}
            aria-label="Table of contents"
            className={`group relative flex flex-col items-end gap-3 py-4 pl-4 pr-2 bg-background max-h-[70vh] overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden transition-all duration-300 ${isNearBottom ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
            {headings.map((heading) => {
                const isActive = activeId === heading.id;
                const isSubheading = heading.level > 2;

                return (
                    <Link
                        key={heading.id}
                        id={`toc-link-${heading.id}`}
                        href={`#${heading.id}`}
                        className="flex items-center justify-end h-5 cursor-pointer shrink-0 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:[&>span]:max-w-70 focus-visible:[&>span]:opacity-100"
                        aria-label={heading.text}
                        aria-current={isActive ? 'location' : undefined}
                    >
                        {/* The text revealed on hover and keyboard focus (expands to the left) */}
                        <span
                            className={`mr-4 overflow-hidden max-w-0 opacity-0 group-hover:max-w-70 group-hover:opacity-100 transition-all duration-500 ease-out whitespace-nowrap text-sm text-right ${
                                isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
                            }`}
                        >
                            {heading.text}
                        </span>

                        {/* The line (strip) on the right edge */}
                        <div
                            aria-hidden="true"
                            className={`h-0.5 rounded-full transition-all duration-300 shrink-0 ${
                                isActive
                                    ? 'w-6 bg-primary shadow-[0_0_8px_rgba(28,33,43,0.5)] dark:shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                                    : 'w-4 bg-primary/20 group-hover:bg-primary/40'
                            } ${isSubheading ? 'mr-3' : ''}`}
                        />
                    </Link>
                );
            })}
        </nav>
    );
}
