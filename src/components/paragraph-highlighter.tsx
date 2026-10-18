'use client';

import React, { useRef, useState, useEffect } from 'react';

export function ParagraphHighlighter({ children }: Readonly<{ children: React.ReactNode }>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [highlightStyle, setHighlightStyle] = useState({
        opacity: 0,
        top: 0,
        left: 0,
        width: 0,
        height: 0
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const isMobileOrTouch = () => window.matchMedia('(max-width: 767px), (hover: none)').matches;

        const handleMouseOver = (e: MouseEvent) => {
            if (isMobileOrTouch()) {
                setHighlightStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
                return;
            }

            const target = e.target as HTMLElement;
            // Exclude blockquotes and TLDR callouts completely
            if (target.closest('blockquote, [data-tldr]')) {
                setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
                return;
            }

            // Target all standard text blocks in MDX
            let block = target.closest('li, p, h1, h2, h3, h4, h5, h6');

            // Exclusions
            if (block) {
                if (block.closest('blockquote, [data-tldr]')) {
                    block = null;
                }
                // Exclude the Project Resources or TL;DR heading
                else if (block.textContent?.trim() === 'Project Resources' || block.textContent?.trim() === 'TL;DR') {
                    block = null;
                }
                // Exclude paragraphs that purely contain Project Resource button links
                else if (block.tagName.toLowerCase() === 'p' && block.querySelector('a.rounded-full')) {
                    const rawText = block.textContent?.replace(/[\s↗→]/g, '') || '';
                    const linksText = Array.from(block.querySelectorAll('a'))
                        .map((a) => a.textContent?.replace(/[\s↗→]/g, '') || '')
                        .join('');

                    if (rawText === linksText) {
                        block = null;
                    }
                }
            }

            // If we matched a paragraph, but it's inside a list item,
            // we should highlight the parent container so bullet points are fully included in the highlight box.
            if (block?.tagName.toLowerCase() === 'p') {
                const parentContainer = block.closest('li');
                if (parentContainer && container.contains(parentContainer)) {
                    block = parentContainer;
                }
            }

            if (block && container.contains(block)) {
                // Calculate position relative to container using bounding rects
                const containerRect = container.getBoundingClientRect();
                const blockRect = block.getBoundingClientRect();

                // Add a bit of padding around the text
                const paddingX = 16;
                const paddingY = 6;

                // List items have bullet points that sit outside the bounding rect (list-style-position: outside).
                // We add extra left padding to ensure the bullet dot is fully enclosed in the highlight.
                const extraLeft = block.tagName.toLowerCase() === 'li' ? 24 : 0;

                setHighlightStyle({
                    opacity: 1,
                    top: blockRect.top - containerRect.top - paddingY,
                    left: blockRect.left - containerRect.left - paddingX - extraLeft,
                    width: blockRect.width + paddingX * 2 + extraLeft,
                    height: blockRect.height + paddingY * 2
                });
            } else {
                // If hovered over something else (like an image margin or outside content), hide highlight
                setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
            }
        };

        const handleMouseLeave = () => {
            setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
        };

        const handleResize = () => {
            if (isMobileOrTouch()) {
                setHighlightStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
            }
        };

        // Use mousemove for more immediate reaction, or mouseover
        container.addEventListener('mouseover', handleMouseOver);
        container.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);

        return () => {
            container.removeEventListener('mouseover', handleMouseOver);
            container.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full group/highlighter">
            <div
                className="hidden md:block absolute rounded-xl bg-amber-400/20 dark:bg-amber-300/10 pointer-events-none transition-all duration-300 ease-out z-0"
                style={highlightStyle}
                aria-hidden="true"
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
