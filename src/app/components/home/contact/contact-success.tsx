'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { PartyPopper, ArrowUpRight, RotateCcw } from 'lucide-react';
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
            className="flex flex-col items-center text-center py-8 sm:py-12 px-4 sm:px-8 rounded-3xl border border-primary/10 bg-primary/2 backdrop-blur-xs max-w-xl mx-auto shadow-sm"
        >
            {/* SVG Gradients matching header's SDE · Systems & AI linear-gradient */}
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

            {/* Celebratory Party-Popper Emblem */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-[#5b45d6]/10 to-[#b86e00]/10 dark:from-[#9282f8]/15 dark:to-[#f3ca4d]/10 border border-[#5b45d6]/20 dark:border-[#9282f8]/30 mb-6 shadow-md shadow-[#5b45d6]/5 dark:shadow-[#9282f8]/10 transition-all">
                <PartyPopper
                    stroke="url(#party-popper-gradient-light)"
                    strokeWidth={2.2}
                    className="w-8 h-8 shrink-0 dark:hidden"
                    aria-hidden="true"
                />
                <PartyPopper
                    stroke="url(#party-popper-gradient-dark)"
                    strokeWidth={2.2}
                    className="w-8 h-8 shrink-0 hidden dark:block"
                    aria-hidden="true"
                />
            </div>

            {/* Success Heading */}
            <h3
                ref={headingRef}
                tabIndex={-1}
                className="outline-none text-3xl sm:text-4xl font-bold tracking-tight mb-3 cursor-default"
            >
                Thank You!
            </h3>

            {/* Success Description */}
            <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto mb-8 cursor-default leading-relaxed">
                Your message has been received! I appreciate you reaching out and will get back to you within 24–48
                hours.
            </p>

            {/* Quick Navigation Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-md mb-6">
                <Button
                    variant="outline"
                    asChild
                    className="h-12 w-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <Link href="/projects" className="inline-flex items-center justify-center gap-2">
                        <span>View My Projects</span>
                        <ArrowUpRight
                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                        />
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    asChild
                    className="h-12 w-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <Link href="/blog" className="inline-flex items-center justify-center gap-2">
                        <span>Read My Blog</span>
                        <ArrowUpRight
                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                        />
                    </Link>
                </Button>
            </div>

            {/* Send Another Message Button */}
            <Button
                type="button"
                variant="ghost"
                onClick={onReset}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Send Another Message</span>
            </Button>
        </div>
    );
}
