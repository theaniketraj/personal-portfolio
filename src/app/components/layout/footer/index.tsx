'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="-translate-y-px bg-background border-t border-primary/10">
            <div className="container">
                <div className="border-x border-primary/10">
                    <div className="max-w-3xl mx-auto flex flex-col gap-10 sm:gap-14 px-4 sm:px-7 py-12 sm:py-16">
                        {/* Top: Header */}
                        <div className="flex flex-col text-2xl sm:text-3xl font-medium tracking-tight">
                            <span className="text-primary cursor-default select-none font-(family-name:--font-space-grotesk)">
                                BUILT WITH CURIOSITY
                            </span>
                            <span className="text-muted-foreground cursor-default select-none font-(family-name:--font-space-grotesk)">
                                ENGINEERED WITH INTENT
                            </span>
                        </div>

                        {/* Middle: Links and Icons */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-10">
                            {/* Left: Navigation Links */}
                            <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-4">
                                <Link
                                    href="https://theaniketraj.github.io/vitae"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative inline-block text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                                >
                                    CV{''}
                                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                                </Link>
                                <Link
                                    href="mailto:theaniketraj@hotmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative inline-block text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                                >
                                    Contact{''}
                                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                                </Link>
                                <Link
                                    href="/blog"
                                    className="group relative inline-block text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                                >
                                    Blog{''}
                                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                                </Link>
                                <Link
                                    href="https://lexumhq.netlify.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-0.5 text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                                >
                                    <span className="relative">
                                        Lexum{''}
                                        <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                                    </span>
                                    <span className="relative flex items-center justify-center overflow-hidden w-4.5 h-4.5 ml-0.5">
                                        <ArrowUpRight className="absolute w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-full group-hover:-translate-y-full" />
                                        <ArrowUpRight className="absolute w-4.5 h-4.5 -translate-x-full translate-y-full transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                                    </span>
                                </Link>
                            </div>

                            {/* Right: Social Handle Component */}
                            <div className="flex items-center">
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <Link
                                        href="https://github.com/theaniketraj"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub"
                                        className="group transition-opacity"
                                    >
                                        <Image
                                            src="/images/icon/github-icon.svg"
                                            alt="GitHub"
                                            width={8}
                                            height={8}
                                            className="w-4.5 h-4.5 opacity-70 group-hover:opacity-100 transition-opacity dark:invert"
                                            style={{ width: 'auto', height: 'auto' }}
                                        />
                                    </Link>
                                    <Link
                                        href="https://www.linkedin.com/in/theaniketraj/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                        className="group transition-opacity"
                                    >
                                        <Image
                                            src="/images/icon/linkedin-icon.svg"
                                            alt="LinkedIn"
                                            width={8}
                                            height={8}
                                            className="w-4.5 h-4.5 opacity-70 group-hover:opacity-100 transition-opacity dark:invert"
                                            style={{ width: 'auto', height: 'auto' }}
                                        />
                                    </Link>
                                    <Link
                                        href="https://plugins.gradle.org/u/theaniketraj"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Gradle"
                                        className="group transition-opacity"
                                    >
                                        <Image
                                            src="/images/icon/gradle.svg"
                                            alt="Gradle"
                                            width={8}
                                            height={8}
                                            className="w-4.5 h-4.5 opacity-70 group-hover:opacity-100 transition-opacity dark:invert"
                                            style={{ width: 'auto', height: 'auto' }}
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Copyright & Back to Top */}
                        <div className="flex items-center justify-between gap-4 pt-10 border-t border-primary/10">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-4">
                                <p className="text-sm font-medium text-muted-foreground cursor-default select-none">
                                    &copy; 2026 Aniket Raj
                                </p>
                                <Link
                                    href="/agents"
                                    className="text-xs text-muted-foreground/50 hover:text-primary transition-colors uppercase tracking-widest font-mono"
                                >
                                    [AI Agents]
                                </Link>
                            </div>

                            <button
                                type="button"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                            >
                                <span className="group-hover:-translate-y-1 transition-transform">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-label="Back to top"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m5 12 7-7 7 7" />
                                        <path d="M12 19V5" />
                                    </svg>
                                </span>
                                {''}
                                BACK TO TOP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
