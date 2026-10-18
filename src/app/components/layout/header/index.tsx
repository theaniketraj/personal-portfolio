'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import Divider from '@/app/components/divider';

const CliTerminal = dynamic(() => import('@/components/ui/cli-terminal'), {
    ssr: false
});

const Header = () => {
    const [isCliOpen, setIsCliOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '`') {
                e.preventDefault();
                setIsCliOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const socialIcon = [
        {
            img: '/images/icon/github-icon.svg',
            href: 'https://github.com/theaniketraj',
            icon: 'GitHub'
        },
        {
            img: '/images/icon/linkedin-icon.svg',
            href: 'https://www.linkedin.com/in/theaniketraj/',
            icon: 'LinkedIn'
        }
    ];

    return (
        <header>
            <div className="container">
                <div className="border-x border-b border-primary/10">
                    <div className="flex flex-col xs:flex-row items-center xs:items-start justify-center xs:justify-between max-w-3xl mx-auto gap-10 xs:gap-3 px-4 sm:px-7 pt-10 sm:pt-14 pb-8 sm:pb-12">
                        <div className="flex flex-col gap-2 sm:gap-3 items-center text-center xs:items-start">
                            <Link
                                href="/"
                                aria-label="Go to homepage"
                                className="group rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <span className="relative inline-block text-2xl sm:text-3xl lg:text-[32px] font-normal">
                                    <span className="transition-opacity duration-300 ease-in-out text-primary group-hover:opacity-0">
                                        Aniket Raj
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 header-gradient-text"
                                    >
                                        Aniket Raj
                                    </span>
                                </span>
                            </Link>
                            <p className="w-fit font-medium cursor-default select-none header-gradient-text">
                                SDE · Systems & AI
                            </p>
                            <div className="flex items-center gap-2">
                                <Image
                                    src={'/images/icon/map-icon.svg'}
                                    alt=""
                                    aria-hidden="true"
                                    width={20}
                                    height={20}
                                    className="dark:invert"
                                />
                                <p className="text-primary cursor-default select-none">India</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex items-center gap-2">
                                {socialIcon?.map((value) => {
                                    return (
                                        <Link
                                            href={value?.href}
                                            key={value?.icon}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={value?.icon}
                                            className="w-9.5 h-9.5 sm:w-11.5 sm:h-11.5 flex items-center justify-center hover:bg-primary/5 border border-primary/10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            <Image
                                                src={value?.img}
                                                alt=""
                                                aria-hidden="true"
                                                width={24}
                                                height={24}
                                                className="dark:invert"
                                            />
                                        </Link>
                                    );
                                })}
                                <button
                                    type="button"
                                    onClick={() => setIsCliOpen(true)}
                                    aria-label="Open Terminal CLI"
                                    aria-haspopup="dialog"
                                    aria-expanded={isCliOpen}
                                    className="w-9.5 h-9.5 sm:w-11.5 sm:h-11.5 flex items-center justify-center hover:bg-primary/5 border border-primary/10 rounded-full transition-colors group cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <Image
                                        src="/images/icon/cmd.svg"
                                        alt=""
                                        aria-hidden="true"
                                        width={24}
                                        height={24}
                                        className="dark:invert transition-opacity group-hover:opacity-70"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 dark:bg-gray-100 text-white dark:text-black text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none z-50 shadow-lg"
                                    >
                                        Open Terminal (`)
                                    </span>
                                </button>
                                <ThemeToggle />
                            </div>
                            <Button
                                asChild
                                className="h-auto rounded-full p-0.5! focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <Link
                                    href="/#contact"
                                    className="group inline-block p-0.5 rounded-full bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <span className="flex items-center gap-3 bg-primary hover:bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)] py-2.5 px-5 rounded-full transition-all">
                                        <Image
                                            src="/images/icon/spark-icon.svg"
                                            alt=""
                                            aria-hidden="true"
                                            width={14}
                                            height={14}
                                            style={{ width: 'auto', height: 'auto' }}
                                            className="w-auto h-auto dark:invert group-hover:invert-0"
                                        />
                                        <span className="text-sm sm:text-base font-semibold text-primary-foreground group-hover:text-white ">
                                            Get in touch
                                        </span>
                                    </span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            {isCliOpen && <CliTerminal isOpen={isCliOpen} onClose={() => setIsCliOpen(false)} />}
        </header>
    );
};

export default Header;
