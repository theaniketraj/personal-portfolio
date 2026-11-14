'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight,
    ArrowUp,
    BookOpen,
    Check,
    ChevronRight,
    Code2,
    Command,
    FolderKanban,
    LoaderCircle,
    Maximize,
    Minimize,
    RotateCcw,
    UserRound,
    X
} from 'lucide-react';
import { fetchProjectsForCli, fetchBlogsForCli } from '@/lib/cli-actions';
import { skillsData, aboutData } from '@/lib/data';

interface CliTerminalProps {
    isOpen: boolean;
    onClose: () => void;
}

type OutputLine = {
    id: string;
    type: 'input' | 'output';
    content: React.ReactNode;
};

type CommandItem = {
    command: string;
    description: string;
    icon: React.ReactNode;
    shortcut?: string;
};

const commandItems: CommandItem[] = [
    { command: 'about', description: 'A little about me and what I do', icon: <UserRound size={15} /> },
    { command: 'skills', description: 'Explore my technical toolkit', icon: <Code2 size={15} /> },
    { command: 'projects', description: 'Browse selected projects', icon: <FolderKanban size={15} /> },
    { command: 'blogs', description: 'Read notes and engineering articles', icon: <BookOpen size={15} /> },
    {
        command: 'reset',
        description: 'Restart the terminal session',
        icon: <RotateCcw size={15} />,
        shortcut: 'ctrl + L'
    },
    { command: 'exit', description: 'Close the command interface', icon: <ArrowRight size={15} /> }
];

const createBootHistory = (): OutputLine[] => {
    const timestamp = Date.now();
    return [
        {
            id: `boot-command-${timestamp}`,
            type: 'input',
            content: 'sys_init'
        },
        {
            id: `boot-response-${timestamp}`,
            type: 'output',
            content: (
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <Check size={12} className="text-emerald-500" />
                            Session initialized
                        </span>
                        <span aria-hidden="true" className="text-border">
                            /
                        </span>
                        <span className="font-mono">{new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">
                        Welcome to my portfolio command interface. Run{' '}
                        <code className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                            help
                        </code>{' '}
                        to explore the available commands.
                    </p>
                </div>
            )
        }
    ];
};

const CliTerminal: React.FC<CliTerminalProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<OutputLine[]>(createBootHistory);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isInputKeyboardFocused, setIsInputKeyboardFocused] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const terminalWindowRef = useRef<HTMLElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);
    const commandSequenceRef = useRef(0);
    const executionLockRef = useRef(false);
    const isKeyboardNavigationRef = useRef(false);

    // Use the native modal top layer so the rest of the document becomes inert.
    useEffect(() => {
        if (!isOpen) return;

        isKeyboardNavigationRef.current = false;

        const dialog = dialogRef.current;
        if (!dialog) return;

        previousActiveElementRef.current = document.activeElement as HTMLElement | null;

        if (!dialog.open) {
            if (typeof dialog.showModal === 'function') {
                dialog.showModal();
            } else {
                dialog.setAttribute('open', '');
            }
        }

        const focusTimer = window.setTimeout(() => {
            inputRef.current?.focus();
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, 60);

        return () => {
            window.clearTimeout(focusTimer);

            if (dialog.open) {
                if (typeof dialog.close === 'function') {
                    dialog.close();
                } else {
                    dialog.removeAttribute('open');
                }
            }

            const previousElement = previousActiveElementRef.current;
            if (previousElement?.isConnected) {
                window.requestAnimationFrame(() => previousElement.focus());
            }
        };
    }, [isOpen]);

    // Reset the window mode on close, but preserve the command history for the next visit.
    useEffect(() => {
        if (!isOpen) setIsFullscreen(false);
    }, [isOpen]);

    // Keep the newest output visible without forcing smooth motion for terminal content.
    useEffect(() => {
        const viewport = scrollRef.current;
        if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }, [history, isExecuting]);

    // Handle keyboard accessibility: Escape or backtick (`) to dismiss, Ctrl/Cmd+L to clear screen, and Tab focus trapping.
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === '`' && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
                event.stopPropagation();
                onClose();
                return;
            }

            if (event.key === 'Tab') {
                isKeyboardNavigationRef.current = true;
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
                return;
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
                event.preventDefault();
                setHistory(createBootHistory());
                return;
            }

            if (event.key === 'Tab') {
                const dialogEl = dialogRef.current;
                if (!dialogEl) return;

                const focusableElements = dialogEl.querySelectorAll<HTMLElement>(
                    'button:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        const handlePointerDown = () => {
            isKeyboardNavigationRef.current = false;
            setIsInputKeyboardFocused(false);
        };

        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('pointerdown', handlePointerDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [isOpen, onClose]);

    // Handle clicking outside the terminal to dismiss and clicking blank areas to focus the input.
    useEffect(() => {
        if (!isOpen) return;

        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (
                target === dialog ||
                target === backdropRef.current ||
                (terminalWindowRef.current && !terminalWindowRef.current.contains(target))
            ) {
                onClose();
                return;
            }

            if (target && !target.closest('a, button, input, textarea, select, [contenteditable="true"]')) {
                inputRef.current?.focus();
            }
        };

        dialog.addEventListener('click', handleClick);
        return () => dialog.removeEventListener('click', handleClick);
    }, [isOpen, onClose]);

    const nextId = () => {
        commandSequenceRef.current += 1;
        return `cli-${Date.now()}-${commandSequenceRef.current}`;
    };

    const handleCommand = async (rawCommand: string) => {
        const trimmed = rawCommand.trim();
        if (!trimmed || executionLockRef.current) return;

        const [baseCommand] = trimmed.toLowerCase().split(/\s+/);
        const commandId = nextId();

        setHistory((current) => [...current, { id: `${commandId}-input`, type: 'input', content: trimmed }]);
        setInput('');

        if (baseCommand === 'reset' || baseCommand === 'clear') {
            setHistory(createBootHistory());
            return;
        }

        if (baseCommand === 'exit') {
            onClose();
            return;
        }

        executionLockRef.current = true;
        setIsExecuting(true);

        let outputContent: React.ReactNode;

        try {
            switch (baseCommand) {
                case 'sys_init':
                    outputContent = (
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <Check size={12} className="text-emerald-500" />
                                Session re-initialized
                                <span className="text-border">/</span>
                                <span className="font-mono">
                                    {new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
                                </span>
                            </div>
                            <p className="text-sm text-foreground/80">
                                Run{' '}
                                <code className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                                    help
                                </code>{' '}
                                to view available commands.
                            </p>
                        </div>
                    );
                    break;

                case 'help':
                    outputContent = (
                        <div className="grid grid-cols-1 gap-2 sm:gap-2.5 sm:grid-cols-2">
                            {commandItems.map((item) => (
                                <button
                                    key={item.command}
                                    type="button"
                                    onClick={() => void handleCommand(item.command)}
                                    className="group flex min-w-0 items-center gap-2.5 sm:gap-3 rounded-xl border border-primary/10 bg-background/60 dark:bg-zinc-900/40 backdrop-blur-sm px-3 py-2 sm:px-3.5 sm:py-3 text-left shadow-xs transition-all hover:border-primary/30 hover:bg-background/90 dark:hover:bg-zinc-900/80 hover:shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-primary/5 text-muted-foreground transition-colors group-hover:text-foreground">
                                        {item.icon}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-center gap-1.5 sm:gap-2">
                                            <span className="block font-mono text-xs sm:text-[13px] font-semibold text-foreground">
                                                {item.command}
                                            </span>
                                            {item.shortcut && (
                                                <kbd className="rounded-sm border border-border bg-muted/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground font-normal leading-none select-none">
                                                    {item.shortcut}
                                                </kbd>
                                            )}
                                        </span>
                                        <span className="mt-0.5 block truncate text-[11px] sm:text-xs text-muted-foreground">
                                            {item.description}
                                        </span>
                                    </span>
                                    <ChevronRight
                                        size={14}
                                        className="shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                                    />
                                </button>
                            ))}
                        </div>
                    );
                    break;

                case 'about':
                case 'info':
                    outputContent = (
                        <div className="space-y-3">
                            <div className="border-l-2 border-primary/40 pl-4">
                                <p className="text-sm font-semibold text-foreground">{aboutData.greeting}</p>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{aboutData.intro}</p>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">{aboutData.philosophy}</p>
                            <p className="text-xs text-muted-foreground">
                                Try{' '}
                                <button
                                    type="button"
                                    onClick={() => void handleCommand('projects')}
                                    className="font-mono font-medium text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xs cursor-pointer"
                                >
                                    projects
                                </button>{' '}
                                to explore my work
                            </p>
                        </div>
                    );
                    break;

                case 'skills':
                case 'skill':
                    outputContent = (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {skillsData.map((skill) => (
                                <section
                                    key={skill.category}
                                    className="rounded-xl border border-primary/10 bg-background/60 dark:bg-zinc-900/40 backdrop-blur-sm p-3.5 shadow-xs"
                                >
                                    <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
                                        {skill.category}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {skill.items.join(', ')}
                                    </p>
                                </section>
                            ))}
                        </div>
                    );
                    break;

                case 'work':
                case 'works':
                case 'projects':
                case 'project': {
                    const projects = await fetchProjectsForCli();
                    outputContent = (
                        <div className="space-y-3">
                            <div className="divide-y divide-primary/10 rounded-xl border border-primary/10 bg-background/60 dark:bg-zinc-900/40 backdrop-blur-sm overflow-hidden shadow-xs">
                                {projects.map((project) => (
                                    <Link
                                        key={project.slug}
                                        href={`/projects/${project.slug}`}
                                        onClick={onClose}
                                        className="group flex items-start justify-between gap-3 sm:gap-4 px-3 py-2.5 sm:px-3.5 sm:py-3 transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                                    >
                                        <span className="min-w-0">
                                            <span className="block text-xs sm:text-sm font-medium text-foreground">
                                                {project.title}
                                            </span>
                                            <span className="mt-0.5 sm:mt-1 block text-[11px] sm:text-xs leading-relaxed text-muted-foreground line-clamp-2 sm:line-clamp-none">
                                                {project.description}
                                            </span>
                                        </span>
                                        <ArrowRight
                                            size={14}
                                            className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                                        />
                                    </Link>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Open the{' '}
                                <Link
                                    href="/projects"
                                    onClick={onClose}
                                    className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                                >
                                    project directory
                                </Link>{' '}
                                for the complete collection
                            </p>
                        </div>
                    );
                    break;
                }

                case 'blogs':
                case 'blog':
                case 'article':
                case 'articles': {
                    const articles = await fetchBlogsForCli();
                    outputContent = (
                        <div className="space-y-3">
                            <div className="divide-y divide-primary/10 rounded-xl border border-primary/10 bg-background/60 dark:bg-zinc-900/40 backdrop-blur-sm overflow-hidden shadow-xs">
                                {articles.map((article) => (
                                    <Link
                                        key={article.slug}
                                        href={`/blog/${article.slug}`}
                                        onClick={onClose}
                                        className="group flex items-start justify-between gap-3 sm:gap-4 px-3 py-2.5 sm:px-3.5 sm:py-3 transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                                    >
                                        <span className="min-w-0">
                                            <span className="block text-xs sm:text-sm font-medium text-foreground">
                                                {article.title}
                                            </span>
                                            <span className="mt-0.5 sm:mt-1 block text-[11px] sm:text-xs leading-relaxed text-muted-foreground line-clamp-2 sm:line-clamp-none">
                                                {article.description}
                                            </span>
                                        </span>
                                        <ArrowRight
                                            size={14}
                                            className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                                        />
                                    </Link>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Browse all writing in the{' '}
                                <Link
                                    href="/blog"
                                    onClick={onClose}
                                    className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                                >
                                    article directory
                                </Link>
                            </p>
                        </div>
                    );
                    break;
                }

                default:
                    outputContent = (
                        <div className="flex items-start gap-2 text-sm text-destructive">
                            <span className="font-mono">ERROR:</span>
                            <span>
                                Command not found: <code className="font-mono">{trimmed}</code>. Run{' '}
                                <code className="rounded-sm border border-border bg-muted px-1 py-0.5 font-mono text-xs">
                                    help
                                </code>{' '}
                                to see available commands.
                            </span>
                        </div>
                    );
            }
        } catch (error) {
            let message = 'The command could not be completed.';
            if (baseCommand === 'projects') {
                message = 'Unable to load the project directory right now.';
            } else if (baseCommand === 'blogs' || baseCommand === 'blog' || baseCommand === 'articles') {
                message = 'Unable to load the article directory right now.';
            }

            outputContent = (
                <div className="flex items-start gap-2 text-sm text-destructive">
                    <span className="font-mono">ERR</span>
                    <span>{message}</span>
                </div>
            );

            // Keep the error available for local debugging without exposing internals in the UI.
            if (process.env.NODE_ENV === 'development') {
                console.error('[portfolio-cli]', error);
            }
        } finally {
            executionLockRef.current = false;
            setIsExecuting(false);
        }

        if (outputContent) {
            setHistory((current) => [
                ...current,
                { id: `${commandId}-output`, type: 'output', content: outputContent }
            ]);
        }
    };

    if (!isOpen) return null;

    return (
        <dialog
            id="cli-terminal-dialog"
            ref={dialogRef}
            aria-modal="true"
            aria-labelledby="cli-terminal-title"
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            className={`fixed inset-0 z-100 m-0 flex h-dvh max-h-none w-screen max-w-none items-center justify-center border-0 bg-transparent text-foreground outline-none backdrop:bg-transparent ${
                isFullscreen ? 'p-2 sm:p-3' : 'p-3.5 sm:p-6 md:p-8'
            }`}
        >
            <div
                ref={backdropRef}
                aria-hidden="true"
                className="fixed inset-0 -z-10 bg-black/40 dark:bg-black/75 backdrop-blur-sm transition-opacity"
            />
            <section
                ref={terminalWindowRef}
                className={`relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-primary/15 dark:border-primary/20 bg-background/95 dark:bg-zinc-950/95 backdrop-blur-xl text-card-foreground shadow-2xl shadow-black/10 dark:shadow-black/60 transition-[width,height] duration-300 ease-out motion-reduce:transition-none ${
                    isFullscreen
                        ? 'h-full w-full'
                        : 'h-[min(540px,calc(100dvh-3rem))] w-full max-w-225 sm:h-[min(680px,calc(100dvh-48px))]'
                }`}
            >
                {/* Subtle laser ambient optics */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-10">
                    {/* Top-left subtle laser bloom */}
                    <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/6 dark:bg-primary/10 blur-3xl" />

                    {/* Bottom-right subtle laser glow */}
                    <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/4 dark:bg-primary/8 blur-3xl" />

                    {/* Top hairline specular accent */}
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 dark:via-white/20 to-transparent" />
                </div>

                <h2 id="cli-terminal-title" className="sr-only">
                    Portfolio command interface
                </h2>

                {/* Window chrome */}
                <header className="flex min-h-12 sm:min-h-14 shrink-0 items-center justify-between gap-3 border-b border-primary/10 bg-background/80 dark:bg-zinc-950/80 backdrop-blur-md px-3 sm:px-5">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                        <Image
                            src="/images/icon/cmd.svg"
                            alt=""
                            aria-hidden="true"
                            className="size-4 sm:size-5 shrink-0 opacity-80 dark:invert"
                        />
                        <p className="truncate text-xs font-semibold tracking-wide text-foreground">Portfolio CLI</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
                        <button
                            type="button"
                            onClick={() => setIsFullscreen((current) => !current)}
                            className="inline-flex size-7 sm:size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        >
                            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex size-7 sm:size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label="Close Terminal"
                            title="Close Terminal"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </header>

                {/* Output stream */}
                <div
                    ref={scrollRef}
                    role="log"
                    aria-live="polite"
                    aria-relevant="additions text"
                    aria-label="Terminal output"
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background/30 dark:bg-zinc-950/30 px-3.5 py-4 sm:px-6 sm:py-6"
                >
                    <div className="mx-auto w-full max-w-190 space-y-4 sm:space-y-5">
                        {history.map((line) => (
                            <div key={line.id} className="group/line min-w-0">
                                {line.type === 'input' ? (
                                    <div className="flex items-start gap-2 sm:gap-2.5">
                                        <ChevronRight
                                            size={15}
                                            className="mt-0.5 shrink-0 text-primary"
                                            strokeWidth={2.2}
                                        />
                                        <div className="min-w-0">
                                            <p className="wrap-break-word font-mono text-[13px] font-medium text-foreground sm:text-sm">
                                                {line.content}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="ml-5 sm:ml-6.5 min-w-0 animate-fadeInScale origin-left motion-reduce:animate-none">
                                        {line.content}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isExecuting && (
                            <div
                                className="ml-5 sm:ml-6.5 flex items-center gap-2 text-xs text-muted-foreground"
                                aria-label="Command is processing"
                            >
                                <LoaderCircle size={13} className="animate-spin motion-reduce:animate-none" />
                                <span className="font-mono">Working…</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Command input */}
                <footer className="shrink-0 border-t border-primary/10 bg-background/80 dark:bg-zinc-950/80 backdrop-blur-md px-3 py-2.5 sm:px-5 sm:py-4">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            void handleCommand(input);
                        }}
                        className="mx-auto w-full max-w-190"
                    >
                        <div
                            data-terminal-input-container=""
                            className={`flex min-h-11 sm:min-h-12 items-center gap-2.5 sm:gap-3 rounded-xl border bg-background/90 dark:bg-zinc-900/80 backdrop-blur-md px-3 sm:px-3.5 shadow-xs transition-all duration-200 ${
                                isInputKeyboardFocused
                                    ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background dark:border-primary'
                                    : 'border-primary/15 dark:border-primary/20'
                            }`}
                        >
                            <Command size={15} className="shrink-0 text-primary" />
                            <label htmlFor="terminal-command-input" className="sr-only">
                                Terminal command input
                            </label>
                            <input
                                id="terminal-command-input"
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onFocus={() => {
                                    if (isKeyboardNavigationRef.current) {
                                        setIsInputKeyboardFocused(true);
                                    }
                                }}
                                onBlur={() => {
                                    setIsInputKeyboardFocused(false);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === '`' && !event.ctrlKey && !event.metaKey && !event.altKey) {
                                        event.preventDefault();
                                        return;
                                    }
                                    if (event.key !== 'Tab' && event.key !== 'Shift') {
                                        setIsInputKeyboardFocused(false);
                                    }
                                }}
                                placeholder="Type a command… try help"
                                aria-label="Terminal command input"
                                data-terminal-input=""
                                autoComplete="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                disabled={isExecuting}
                                className="h-10 sm:h-11 min-w-0 flex-1 bg-transparent font-mono text-[13px] text-foreground placeholder:text-muted-foreground/65 disabled:cursor-wait sm:text-sm outline-none! ring-0! ring-offset-0! shadow-none! focus:outline-none! focus:ring-0! focus:ring-offset-0! focus:shadow-none! focus-visible:outline-none! focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:shadow-none!"
                                style={{ outline: 'none', boxShadow: 'none' }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isExecuting}
                                className="inline-flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                aria-label="Run command"
                                title="Run command"
                            >
                                {isExecuting ? (
                                    <LoaderCircle size={13} className="animate-spin motion-reduce:animate-none" />
                                ) : (
                                    <ArrowUp size={14} />
                                )}
                            </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2 px-1 text-[10px] text-muted-foreground sm:grid sm:grid-cols-3 sm:gap-0 cursor-default select-none">
                            <span className="font-mono text-left">
                                {history.length.toString().padStart(2, '0')} LINES
                            </span>
                            <span className="hidden text-center truncate sm:inline-block">
                                Explore my portfolio through commands
                            </span>
                            <span className="flex items-center justify-end gap-1.5 sm:gap-2 font-mono">
                                <span className="inline-flex items-center gap-1">
                                    <kbd className="rounded-sm border border-border bg-muted px-1.5 py-0.5">↵</kbd> run
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <kbd className="rounded-sm border border-border bg-muted px-1.5 py-0.5">esc</kbd>{' '}
                                    close
                                </span>
                            </span>
                        </div>
                    </form>
                </footer>
            </section>
        </dialog>
    );
};

export default CliTerminal;
