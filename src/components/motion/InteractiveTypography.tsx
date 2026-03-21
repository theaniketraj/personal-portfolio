'use client';

import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';

const ELEGANT_FONTS = [
    '"Playfair Display", serif',
    '"Cormorant Garamond", serif',
    '"Bodoni Moda", serif',
    '"Libre Baskerville", serif',
    '"Spectral", serif',
    '"EB Garamond", serif',
    '"Crimson Text", serif'
];

interface InteractiveTypographyProps {
    text: string;
    className?: string;
}

export const InteractiveTypography: React.FC<InteractiveTypographyProps> = ({ text, className }) => {
    const [mounted, setMounted] = useState(false);

    // stable random font mapping (no re-renders)
    const randomFonts = useMemo(() => {
        return text.split('').map(() => ELEGANT_FONTS[Math.floor(Math.random() * ELEGANT_FONTS.length)]);
    }, [text]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const words = text.split(' ');
    let globalCharIndex = 0;

    return (
        <>
            {mounted && (
                <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda&family=Cormorant+Garamond&family=Crimson+Text&family=EB+Garamond&family=Libre+Baskerville&family=Playfair+Display&family=Spectral&display=swap');
        `}</style>
            )}

            <span className={classNames('inline-block', className)}>
                {words.map((word, wIndex) => {
                    const wordContent = (
                        <span key={wIndex} className="inline-block whitespace-nowrap">
                            {word.split('').map((char, cIndex) => {
                                const currentIndex = globalCharIndex++;
                                return (
                                    <span key={cIndex} className="relative inline-block whitespace-pre group">
                                        {/* invisible hitbox */}
                                        <span className="invisible select-none">{char}</span>

                                        {/* base layer */}
                                        <span
                                            className="
                                                absolute inset-0
                                                transition-opacity duration-300 ease-out
                                                opacity-100 group-hover:opacity-0
                                                pointer-events-none
                                            "
                                        >
                                            {char}
                                        </span>

                                        {/* hover serif layer */}
                                        <span
                                            className="
                                                absolute inset-0
                                                transition-opacity duration-300 ease-out
                                                opacity-0 group-hover:opacity-100
                                                pointer-events-none
                                            "
                                            style={{ fontFamily: randomFonts[currentIndex] }}
                                        >
                                            {char}
                                        </span>
                                    </span>
                                );
                            })}
                            {/* Keep trailing space except for the last word */}
                            {wIndex < words.length - 1 && (
                                <span className="relative inline-block whitespace-pre group">
                                    <span className="invisible select-none"> </span>
                                    <span className="absolute inset-0 transition-opacity duration-300 ease-out opacity-100 group-hover:opacity-0 pointer-events-none">
                                        {' '}
                                    </span>
                                    <span
                                        className="absolute inset-0 transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100 pointer-events-none"
                                        style={{ fontFamily: randomFonts[globalCharIndex++] }}
                                    >
                                        {' '}
                                    </span>
                                </span>
                            )}
                        </span>
                    );
                    return wordContent;
                })}
            </span>
        </>
    );
};
