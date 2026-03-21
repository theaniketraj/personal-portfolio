'use client';

import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ELEGANT_FONTS = [
    '"Playfair Display", serif',
    '"Cinzel", serif',
    '"Bodoni Moda", serif',
    '"Baskervville", serif',
    '"Cormorant Garamond", serif',
    '"Merriweather", serif',
    '"Lora", serif',
    '"Libre Baskerville", serif',
    '"PT Serif", serif',
    '"Nanum Myeongjo", serif',
    '"Abhaya Libre", serif',
    '"Prata", serif',
    '"Vollkorn", serif',
    '"Zilla Slab", serif',
    '"Spectral", serif',
    '"EB Garamond", serif',
    '"Crimson Text", serif',
    '"Cormorant", serif',
    '"Marcellus", serif',
    '"Philosopher", sans-serif'
];

interface InteractiveTypographyProps {
    text: string;
    className?: string;
}

export const InteractiveTypography: React.FC<InteractiveTypographyProps> = ({ text, className }) => {
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [randomFonts, setRandomFonts] = useState<string[]>([]);

    // Custom cursor state
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
    const [isHovered, setIsHovered] = useState(false);
    const [cursorSize, setCursorSize] = useState(80);

    useEffect(() => {
        setMounted(true);
        // Map 20 distinct elegant fonts dynamically purely on the client
        setRandomFonts(text.split('').map(() => ELEGANT_FONTS[Math.floor(Math.random() * ELEGANT_FONTS.length)]));

        const updateCursor = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            
            // Critical fix: calculate relative offset and divide by the container's scale 
            // to neutralize framer-motion transformations!
            const scaleX = rect.width / (containerRef.current.offsetWidth || 1);
            const scaleY = rect.height / (containerRef.current.offsetHeight || 1);
            
            setCursorPos({ 
                x: (e.clientX - rect.left) / scaleX, 
                y: (e.clientY - rect.top) / scaleY
            });
        };
        
        window.addEventListener('mousemove', updateCursor, { passive: true });
        return () => window.removeEventListener('mousemove', updateCursor);
    }, [text]);

    useEffect(() => {
        if (mounted && containerRef.current) {
            const style = window.getComputedStyle(containerRef.current);
            const fontSize = parseFloat(style.fontSize) || 60; 
            setCursorSize(fontSize * 1.5);
        }
    }, [mounted, text]);

    const chars = text.split('');

    return (
        <>
            {mounted && (
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Abhaya+Libre&family=Baskervville&family=Bodoni+Moda&family=Cinzel&family=Cormorant&family=Cormorant+Garamond&family=Crimson+Text&family=EB+Garamond&family=Libre+Baskerville&family=Lora&family=Marcellus&family=Merriweather&family=Nanum+Myeongjo&family=PT+Serif&family=Philosopher&family=Playfair+Display&family=Prata&family=Spectral&family=Vollkorn&family=Zilla+Slab&display=swap');
                `}</style>
            )}

            <div
                ref={containerRef}
                className={classNames('relative inline-block cursor-none', className)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Absolute custom cursor mapped precisely via scale math. Sits cleanly behind text (z-[1]) */}
                <div
                    className={classNames(
                        'absolute rounded-full flex items-center justify-center pointer-events-none z-[1]',
                        'transition-[width,height,background-color] duration-300 ease-out'
                    )}
                    style={{
                        left: `${cursorPos.x}px`,
                        top: `${cursorPos.y}px`,
                        width: isHovered ? `${cursorSize}px` : '0px',
                        height: isHovered ? `${cursorSize}px` : '0px',
                        backgroundColor: 'black',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
                
                {chars.map((char, i) => (
                    <span key={i} className="relative inline-block group cursor-none">
                        {/* 
                          CRITICAL FIX: 
                          The invisible layer acts as the actual physical hit-box for the hover. 
                          It MUST NOT have pointer-events-none, otherwise the mouse goes right through it! 
                        */}
                        <span className="invisible select-none whitespace-pre">
                            {char}
                        </span>

                        {/* Base character crossfades out IMMEDIATELY when hovered (0ms), returns DELAYED over 500ms */}
                        <span className="absolute left-0 top-0 w-full h-full text-center opacity-100 group-hover:opacity-0 transition-opacity duration-[500ms] group-hover:duration-0 pointer-events-none z-10 whitespace-pre font-sans">
                            {char}
                        </span>

                        {/* Hover character (unique font) crossfades in IMMEDIATELY (0ms), fades out DELAYED over 500ms */}
                        <span
                            className="absolute left-0 top-0 w-full h-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-[500ms] group-hover:duration-0 pointer-events-none z-20 whitespace-pre"
                            style={{ fontFamily: randomFonts[i] || 'inherit' }}
                        >
                            {char}
                        </span>
                    </span>
                ))}
            </div>
        </>
    );
};
