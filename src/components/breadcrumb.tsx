import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    backHref: string;
    backLabel: string;
}

export function Breadcrumb({ items, backHref, backLabel }: Readonly<BreadcrumbProps>) {
    return (
        <nav aria-label="Breadcrumb" className="flex flex-nowrap whitespace-nowrap items-center gap-2.5">
            {/* Interactive Back Pill */}
            <Link
                href={backHref}
                aria-label={`Go back to ${backLabel}`}
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/15 bg-primary/5 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary font-mono text-xs font-medium transition-all shadow-2xs shrink-0 select-none"
            >
                <span className="relative inline-flex items-center justify-center w-3.5 h-3.5 overflow-hidden shrink-0">
                    <ArrowLeft
                        className="w-3.5 h-3.5 transition-all duration-300 ease-out group-hover:-translate-x-full group-hover:opacity-0 group-focus-visible:-translate-x-full group-focus-visible:opacity-0"
                        aria-hidden="true"
                    />
                    <ArrowLeft
                        className="absolute inset-0 w-3.5 h-3.5 translate-x-full opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                        aria-hidden="true"
                    />
                </span>
                <span>{backLabel}</span>
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-primary/30 shrink-0" aria-hidden="true" />

            {/* Path Items */}
            <ol className="flex items-center gap-2 overflow-hidden list-none m-0 p-0">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={item.label} className="inline-flex items-center gap-2">
                            {index > 0 && (
                                <ChevronRight className="w-3.5 h-3.5 text-primary/30 shrink-0" aria-hidden="true" />
                            )}
                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className="text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs font-medium text-xs sm:text-sm transition-colors shrink-0"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    aria-current="page"
                                    className="text-primary font-medium text-xs sm:text-sm truncate inline-block max-w-35 sm:max-w-50 md:max-w-62.5 shrink-0 cursor-default select-none"
                                >
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
