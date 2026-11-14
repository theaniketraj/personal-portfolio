'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { PartyPopper, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactSuccessProps {
    onReset: () => void;
}

export function ContactSuccess({ onReset }: Readonly<ContactSuccessProps>) {
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="flex flex-col items-center text-center py-6 sm:py-10 max-w-xl mx-auto"
        >
            <svg width="0" height="0" className="absolute -z-10 opacity-0 pointer-events-none" aria-hidden="true">
                <defs>
                    <linearGradient id="party-popper-gradient-light" x1="12.17%" y1="0%" x2="90.71%" y2="100%">
                        <stop offset="0%" stopColor="#5b45d6" />
                        <stop offset="100%" stopColor="#b86e00" />
                    </linearGradient>
                    <linearGradient id="party-popper-gradient-dark" x1="12.17%" y1="0%" x2="90.71%" y2="100%">
                        <stop offset="0%" stopColor="#9282f8" />
                        <stop offset="100%" stopColor="#f3ca4d" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="relative mb-6 flex items-center justify-center">
                <div
                    aria-hidden="true"
                    className="absolute w-28 h-28 -top-2 rounded-full bg-linear-to-tr from-[#5b45d6]/20 to-[#b86e00]/20 dark:from-[#9282f8]/25 dark:to-[#f3ca4d]/25 blur-2xl pointer-events-none animate-glow-pulse"
                />

                <div className="relative animate-popper-celebrate flex items-center justify-center">
                    <PartyPopper
                        stroke="url(#party-popper-gradient-light)"
                        strokeWidth={2}
                        className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 dark:hidden drop-shadow-sm"
                        aria-hidden="true"
                    />
                    <PartyPopper
                        stroke="url(#party-popper-gradient-dark)"
                        strokeWidth={2}
                        className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 hidden dark:block drop-shadow-sm"
                        aria-hidden="true"
                    />
                </div>
            </div>

            <h3
                ref={headingRef}
                tabIndex={-1}
                className="outline-none text-3xl sm:text-4xl md:text-5xl font-bold font-(family-name:--font-space-grotesk) tracking-tight mb-4 cursor-default select-none"
            >
                <span className="gradient-text">Thank You.</span>
            </h3>

            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-8 cursor-default leading-relaxed select-none font-(family-name:--font-space-grotesk)">
                Your message has been received. I appreciate you reaching out and will get back to you as soon as
                possible.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-md mb-8">
                <Button
                    variant="outline"
                    asChild
                    className="h-11 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none"
                >
                    <Link href="/projects" className="inline-flex items-center justify-center">
                        View My Projects
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    asChild
                    className="h-11 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none"
                >
                    <Link href="/blog" className="inline-flex items-center justify-center">
                        Read My Blog
                    </Link>
                </Button>
            </div>

            <Button
                type="button"
                variant="ghost"
                onClick={onReset}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none cursor-pointer"
            >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Send Another Message</span>
            </Button>
        </div>
    );
}
