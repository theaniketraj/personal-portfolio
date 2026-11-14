'use client';

import React, { useRef, useState, useEffect } from 'react';

const isMobileOrTouch = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px), (hover: none)').matches;

const isExcludedResourceParagraph = (block: HTMLElement): boolean => {
    if (block.tagName.toLowerCase() !== 'p' || !block.querySelector('a.rounded-full')) {
        return false;
    }
    const rawText = block.textContent?.replace(/[\s↗→]/g, '') || '';
    const linksText = Array.from(block.querySelectorAll('a'))
        .map((a) => a.textContent?.replace(/[\s↗→]/g, '') || '')
        .join('');

    return rawText === linksText;
};

const isExcludedBlock = (block: HTMLElement): boolean => {
    if (block.closest('blockquote, [data-tldr]')) {
        return true;
    }
    const text = block.textContent?.trim();
    if (text === 'Project Resources' || text === 'TL;DR') {
        return true;
    }
    return isExcludedResourceParagraph(block);
};

const getTargetBlock = (target: HTMLElement, container: HTMLElement): HTMLElement | null => {
    if (target.closest('blockquote, [data-tldr]')) {
        return null;
    }

    const block = target.closest('li, p, h1, h2, h3, h4, h5, h6') as HTMLElement | null;
    if (!block || isExcludedBlock(block)) {
        return null;
    }

    // If paragraph is inside a list item, highlight parent list item for bullet point inclusion
    if (block.tagName.toLowerCase() === 'p') {
        const parentLi = block.closest('li');
        if (parentLi && container.contains(parentLi)) {
            return parentLi;
        }
    }

    return container.contains(block) ? block : null;
};

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

        const handleMouseOver = (e: MouseEvent) => {
            if (isMobileOrTouch()) {
                setHighlightStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
                return;
            }

            const block = getTargetBlock(e.target as HTMLElement, container);
            if (!block) {
                setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
                return;
            }

            // Calculate position relative to container using bounding rects
            const containerRect = container.getBoundingClientRect();
            const blockRect = block.getBoundingClientRect();

            // Add padding around the text
            const paddingX = 16;
            const paddingY = 6;

            // List items have bullet points outside the bounding rect (list-style-position: outside)
            const extraLeft = block.tagName.toLowerCase() === 'li' ? 24 : 0;

            setHighlightStyle({
                opacity: 1,
                top: blockRect.top - containerRect.top - paddingY,
                left: blockRect.left - containerRect.left - paddingX - extraLeft,
                width: blockRect.width + paddingX * 2 + extraLeft,
                height: blockRect.height + paddingY * 2
            });
        };

        const handleMouseLeave = () => {
            setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
        };

        const handleResize = () => {
            if (isMobileOrTouch()) {
                setHighlightStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
            }
        };

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
