'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Maximize, Minimize, X } from 'lucide-react';
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

const CliTerminal: React.FC<CliTerminalProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<OutputLine[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial boot sequence
    useEffect(() => {
        if (isOpen && history.length === 0) {
            setHistory([
                {
                    id: 'boot-1',
                    type: 'input',
                    content: 'sys_init'
                },
                {
                    id: 'boot-2',
                    type: 'output',
                    content: (
                        <div className="flex flex-col gap-1 my-3 pl-3 border-l-2 border-primary/20 dark:border-white/10">
                            <span className="text-secondary dark:text-gray-400 font-mono text-xs sm:text-[13px]">
                                Shell initialized at {new Date().toISOString().replace('T', ' ').split('.')[0]} UTC
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 mt-1">
                                Type <span className="text-[#9282F8] font-bold">help</span> to view available operations
                            </span>
                        </div>
                    )
                }
            ]);
        }
    }, [isOpen, history.length]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Scroll to bottom on new output
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = async (cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        const inputId = Date.now().toString();
        const newHistory: OutputLine[] = [...history, { id: inputId, type: 'input', content: trimmed }];

        const args = trimmed.toLowerCase().split(' ');
        const baseCmd = args[0];

        // Optimistically update with input
        setHistory(newHistory);
        setInput('');

        let outputContent: React.ReactNode = null;

        switch (baseCmd) {
            case 'sys_init':
                outputContent = (
                    <div className="flex flex-col gap-1 my-3 pl-3 border-l-2 border-primary/20 dark:border-white/10">
                        <span className="text-secondary dark:text-gray-400 font-mono text-xs sm:text-[13px]">
                            Shell re-initialized at {new Date().toISOString().replace('T', ' ').split('.')[0]} UTC
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 mt-1">
                            Type <span className="text-[#9282F8] font-bold">help</span> to view available operations
                        </span>
                    </div>
                );
                break;
            case 'help':
                outputContent = (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 my-4">
                        {[
                            { cmd: 'about', desc: 'Biography & Focus' },
                            { cmd: 'skills', desc: 'Core Technology Stack' },
                            { cmd: 'projects', desc: 'View latest projects' },
                            { cmd: 'blogs', desc: 'View latest articles' },
                            { cmd: 'clear', desc: 'Clear screen history' },
                            { cmd: 'exit', desc: 'Terminate shell console' }
                        ].map((item) => (
                            <div
                                key={item.cmd}
                                className="group flex flex-col pl-3 border-l-2 border-transparent hover:border-primary/20 dark:hover:border-white/20 transition-all hover:translate-x-1 cursor-default"
                            >
                                <span className="font-bold text-black dark:text-white">{item.cmd}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</span>
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'exit':
                onClose();
                return;
            case 'about':
            case 'info':
                outputContent = (
                    <div className="flex flex-col gap-3 my-4 pl-3 border-l-2 border-[#9282F8]/30">
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            <span className="font-bold text-black dark:text-white">{aboutData.greeting}</span>{' '}
                            {aboutData.intro}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{aboutData.philosophy}</span>
                        <span className="text-sm text-gray-500 mt-1">
                            Type <span className="text-[#9282F8] font-bold">projects</span> to see my work
                        </span>
                    </div>
                );
                break;
            case 'skills':
            case 'skill':
                outputContent = (
                    <div className="flex flex-col gap-4 my-4">
                        {skillsData.map((s) => (
                            <div
                                key={s.category}
                                className="flex flex-col pl-3 border-l-2 border-primary/10 dark:border-white/10 hover:border-[#9282F8]/50 transition-colors"
                            >
                                <span className="font-bold text-black dark:text-white mb-1">{s.category}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {s.items.join(', ')}
                                </span>
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'projects':
            case 'project':
                try {
                    const projs = await fetchProjectsForCli();
                    outputContent = (
                        <div className="flex flex-col gap-4 my-4">
                            <span className="font-bold bg-clip-text text-transparent bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)] tracking-wider text-sm">
                                [ DIRECTORY: /projects ]
                            </span>
                            <div className="flex flex-col gap-4">
                                {projs.map((p) => (
                                    <div
                                        key={p.slug}
                                        className="group flex flex-col pl-3 border-l-2 border-primary/10 dark:border-white/10 hover:border-[#9282F8] transition-all hover:translate-x-1"
                                    >
                                        <span className="font-bold text-black dark:text-white">{p.title}</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {p.description}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 mt-2 pl-3">
                                Navigate to{' '}
                                <Link
                                    href="/projects"
                                    className="text-[#9282F8] hover:underline cursor-pointer font-medium"
                                >
                                    /projects
                                </Link>{' '}
                                to view full details
                            </span>
                        </div>
                    );
                } catch (e) {
                    outputContent = (
                        <div className="text-red-500/90 dark:text-red-400/90 my-3 pl-3 border-l-2 border-red-500/30">
                            [ERROR] Failed to load projects from registry.
                        </div>
                    );
                }
                break;
            case 'blogs':
            case 'blog':
            case 'articles':
                try {
                    const articles = await fetchBlogsForCli();
                    outputContent = (
                        <div className="flex flex-col gap-4 my-4">
                            <span className="font-bold bg-clip-text text-transparent bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)] tracking-wider text-sm">
                                [ DIRECTORY: /blog ]
                            </span>
                            <div className="flex flex-col gap-4">
                                {articles.map((a) => (
                                    <div
                                        key={a.slug}
                                        className="group flex flex-col pl-3 border-l-2 border-primary/10 dark:border-white/10 hover:border-[#F3CA4D] transition-all hover:translate-x-1"
                                    >
                                        <span className="font-bold text-black dark:text-white">{a.title}</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {a.description}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 mt-2 pl-3">
                                Navigate to{' '}
                                <Link
                                    href="/blog"
                                    className="text-[#F3CA4D] hover:underline cursor-pointer font-medium"
                                >
                                    /blog
                                </Link>{' '}
                                to read full articles
                            </span>
                        </div>
                    );
                } catch (e) {
                    outputContent = (
                        <div className="text-red-500/90 dark:text-red-400/90 my-3 pl-3 border-l-2 border-red-500/30">
                            [ERROR] Failed to load articles from registry.
                        </div>
                    );
                }
                break;

            default:
                outputContent = (
                    <div className="text-red-500/90 dark:text-red-400/90 my-3 pl-3 border-l-2 border-red-500/30">
                        [ERROR] command not found: {trimmed}
                    </div>
                );
        }

        if (outputContent) {
            setHistory((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    type: 'output',
                    content: outputContent
                }
            ]);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-8"
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            }}
        >
            <button
                type="button"
                className="absolute inset-0 w-full h-full bg-black/40 dark:bg-black/60 backdrop-blur-sm cursor-default border-none outline-none transition-opacity"
                onClick={onClose}
                aria-label="Close terminal"
                tabIndex={-1}
            />
            <div
                role="presentation"
                className={`relative z-10 bg-white/85 dark:bg-zinc-950/80 backdrop-blur-2xl border border-primary/10 dark:border-white/10 rounded-xl flex flex-col font-mono text-sm sm:text-base overflow-hidden transition-all duration-300 shadow-2xl dark:shadow-[0_0_40px_rgba(146,130,248,0.15)] ${
                    isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl h-[75vh] sm:h-162.5'
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.focus();
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-200/50 dark:border-white/10 select-none bg-black/5 dark:bg-white/5">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <img src="/images/icon/cmd.svg" alt="Terminal" className="w-9 h-9 opacity-70 dark:invert" />
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsFullscreen(!isFullscreen);
                            }}
                            className="hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 p-1 rounded transition-colors cursor-pointer flex items-center justify-center"
                            aria-label="Toggle Fullscreen"
                        >
                            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 p-1 rounded transition-colors cursor-pointer flex items-center justify-center"
                            aria-label="Close Terminal"
                        >
                            <X size={17} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-5 sm:p-7 text-gray-700 dark:text-gray-300 scroll-smooth"
                >
                    {history.map((line) => (
                        <div key={line.id} className="mb-2">
                            {line.type === 'input' ? (
                                <div className="flex items-center">
                                    <span className="font-bold bg-clip-text text-transparent bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)] mr-2 select-none">
                                        $
                                    </span>
                                    <span className="text-gray-900 dark:text-gray-100 font-medium">{line.content}</span>
                                </div>
                            ) : (
                                <div className="animate-fadeInScale origin-left">{line.content}</div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer with Input */}
                <div className="px-5 py-4 border-t border-gray-200/50 dark:border-white/10 flex items-center justify-between bg-black/5 dark:bg-white/5">
                    <div className="flex items-center flex-1 mr-4">
                        <span className="font-bold bg-clip-text text-transparent bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)] mr-2 select-none text-base sm:text-lg">
                            $
                        </span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleCommand(input);
                                }
                            }}
                            placeholder="Type 'help' to examine capabilities..."
                            className="flex-1 bg-transparent border-none focus:ring-0 focus:ring-offset-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-400/70 dark:placeholder:text-gray-600 text-sm sm:text-base outline-none! shadow-none! caret-violet-500 font-medium"
                            style={{ outline: 'none', boxShadow: 'none' }}
                            autoComplete="off"
                            spellCheck="false"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CliTerminal;
