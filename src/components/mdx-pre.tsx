'use client';

import * as React from 'react';
import { MdxCopyButton } from './mdx-copy-button';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface MdxPreProps extends React.ComponentProps<'pre'> {
    'data-language'?: string;
    [key: `data-${string}`]: unknown;
}

export function MdxPre({ children, className, ...props }: Readonly<MdxPreProps>) {
    const preRef = React.useRef<HTMLPreElement>(null);
    const [text, setText] = React.useState('');
    const [isCollapsible, setIsCollapsible] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(true);

    React.useEffect(() => {
        if (preRef.current) {
            const content = preRef.current.textContent || '';
            setText(content);
            // Rough estimation of lines
            const lineCount = content.split('\n').length;
            if (lineCount > 15) {
                setIsCollapsible(true);
            }
        }
    }, []);

    // Extract data attributes to pass to the wrapper so CSS toggling works
    const dataProps = Object.keys(props).reduce<Record<`data-${string}`, unknown>>((acc, key) => {
        if (key.startsWith('data-')) {
            acc[key as `data-${string}`] = props[key as keyof typeof props];
        }
        return acc;
    }, {});

    const dataLanguage = props['data-language'];

    return (
        <div className="relative group my-8 w-full" {...dataProps}>
            <div className="flex items-center justify-between px-4 py-2 bg-primary/3 border border-b-0 border-primary/10 rounded-t-xl h-11">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                    <div className="w-3 h-3 rounded-full bg-primary/10"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/10"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/10"></div>
                </div>

                <div className="flex items-center gap-3">
                    {dataLanguage && (
                        <span className="text-xs font-mono uppercase tracking-wider text-secondary opacity-60">
                            {dataLanguage}
                        </span>
                    )}
                    {isCollapsible && (
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs p-0.5 transition-opacity text-secondary hover:text-primary flex items-center justify-center cursor-pointer"
                            aria-label={isCollapsed ? 'Expand code block' : 'Collapse code block'}
                            aria-expanded={!isCollapsed}
                            title={isCollapsed ? 'Expand code' : 'Collapse code'}
                        >
                            <ChevronDown
                                aria-hidden="true"
                                className={cn(
                                    'w-5 h-5 transition-transform duration-300',
                                    !isCollapsed && 'rotate-180'
                                )}
                            />
                        </button>
                    )}
                    <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <MdxCopyButton text={text} />
                    </div>
                </div>
            </div>

            {/* Code Area */}
            <div className="relative">
                <pre
                    ref={preRef}
                    className={cn(
                        'px-5 py-5 rounded-b-xl font-mono text-sm border border-primary/10 bg-primary/1.5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] transition-[max-height] duration-500 ease-in-out',
                        isCollapsible && isCollapsed ? 'max-h-87.5 overflow-hidden' : 'max-h-[5000px] overflow-x-auto',
                        className
                    )}
                    {...props}
                >
                    {children}
                </pre>
                {isCollapsible && isCollapsed && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-[hsl(var(--background))] to-transparent rounded-b-xl pointer-events-none border-b border-primary/10" />
                )}
            </div>
        </div>
    );
}
