'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';

interface InteractiveLineProps {
    text: string;
    baseColorClass: string;
}

interface CharToken {
    id: string;
    char: string;
    index: number;
    progress: number;
}

interface WordToken {
    id: string;
    groupId: string;
    chars: CharToken[];
    hasTrailingSpace: boolean;
}

const InteractiveLine: React.FC<InteractiveLineProps> = ({ text, baseColorClass }) => {
    const totalChars = text.length;

    // Track active/illuminated characters (creates the trailing ripple wave)
    const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set());
    const timeoutMapRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

    const activateIndex = useCallback((index: number) => {
        setActiveIndices((prev) => {
            if (prev.has(index)) return prev;
            const next = new Set(prev);
            next.add(index);
            return next;
        });

        // Clear existing timer if any
        const existingTimer = timeoutMapRef.current.get(index);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        // Leave illuminated for 650ms, then smoothly fade back
        const timer = setTimeout(() => {
            setActiveIndices((prev) => {
                const next = new Set(prev);
                next.delete(index);
                return next;
            });
            timeoutMapRef.current.delete(index);
        }, 650);

        timeoutMapRef.current.set(index, timer);
    }, []);

    // Clean up timers on unmount
    useEffect(() => {
        const timers = timeoutMapRef.current;
        return () => {
            timers.forEach((t) => clearTimeout(t));
            timers.clear();
        };
    }, []);

    // Precompute structured tokens with stable IDs to avoid array indices in React keys
    const wordTokens = useMemo<WordToken[]>(() => {
        const rawWords = text.split(' ');
        const total = text.length;
        let globalIndex = 0;

        return rawWords.map((word, wIdx) => {
            const startOffset = globalIndex;
            const chars: CharToken[] = [];

            for (let i = 0; i < word.length; i++) {
                const charIndex = globalIndex;
                globalIndex++;
                chars.push({
                    id: `char-${startOffset}-${i}-${word[i]}`,
                    char: word[i],
                    index: charIndex,
                    progress: total > 1 ? (charIndex / (total - 1)) * 100 : 0
                });
            }

            const hasTrailingSpace = wIdx < rawWords.length - 1;
            if (hasTrailingSpace) {
                globalIndex++; // Space counts towards character positioning
            }

            return {
                id: `word-${startOffset}-${word}`,
                groupId: `group-${startOffset}-${word}`,
                chars,
                hasTrailingSpace
            };
        });
    }, [text]);

    return (
        <div className="flex flex-wrap items-center cursor-default select-none leading-tight">
            <span className="sr-only">{text}</span>
            <span aria-hidden="true" className="flex flex-wrap items-center">
                {wordTokens.map((wordToken) => {
                    const renderedWord = (
                        <span key={wordToken.id} className="inline-flex items-center whitespace-nowrap">
                            {wordToken.chars.map((charToken) => {
                                const isLit = activeIndices.has(charToken.index);

                                return (
                                    <span
                                        key={charToken.id}
                                        data-char-idx={charToken.index}
                                        className="relative inline-flex items-center justify-center group/char cursor-default"
                                        onMouseEnter={() => activateIndex(charToken.index)}
                                    >
                                        {/* Base layer (solid typography) */}
                                        <span
                                            className={`transition-opacity duration-700 ease-out ${
                                                isLit
                                                    ? 'opacity-0 duration-75'
                                                    : 'group-hover/char:opacity-0 group-hover/char:duration-75'
                                            } ${baseColorClass}`}
                                        >
                                            {charToken.char}
                                        </span>

                                        {/* Gradient layer (signature header gradient) */}
                                        <span
                                            aria-hidden="true"
                                            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out footer-char-gradient flex items-center justify-center ${
                                                isLit
                                                    ? 'opacity-100 duration-75'
                                                    : 'opacity-0 group-hover/char:opacity-100 group-hover/char:duration-75'
                                            }`}
                                            style={{
                                                backgroundSize: `${totalChars * 100}% 100%`,
                                                backgroundPosition: `${charToken.progress}% 0%`
                                            }}
                                        >
                                            {charToken.char}
                                        </span>
                                    </span>
                                );
                            })}
                        </span>
                    );

                    // Add space between words
                    if (wordToken.hasTrailingSpace) {
                        return (
                            <React.Fragment key={wordToken.groupId}>
                                {renderedWord}
                                <span className="inline-block">&nbsp;</span>
                            </React.Fragment>
                        );
                    }

                    return renderedWord;
                })}
            </span>
        </div>
    );
};

export const InteractiveFooterBrand: React.FC = () => {
    return (
        <div className="flex flex-col text-2xl sm:text-3xl font-medium tracking-tight font-(family-name:--font-space-grotesk)">
            {/* Mobile: Plain static typography */}
            <div className="flex flex-col md:hidden">
                <span className="text-primary cursor-default select-none">BUILT WITH CURIOSITY</span>
                <span className="text-muted-foreground cursor-default select-none">ENGINEERED WITH INTENT</span>
            </div>

            {/* Desktop: Interactive letter-by-letter hover gradient */}
            <div className="hidden md:flex md:flex-col">
                <InteractiveLine text="BUILT WITH CURIOSITY" baseColorClass="text-primary" />
                <InteractiveLine text="ENGINEERED WITH INTENT" baseColorClass="text-muted-foreground" />
            </div>
        </div>
    );
};

export default InteractiveFooterBrand;
