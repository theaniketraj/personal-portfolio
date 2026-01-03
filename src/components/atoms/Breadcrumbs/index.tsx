import ArrowRightIcon from '@/components/svgs/arrow-right';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Fragment } from 'react';

export interface BreadcrumbItem {
    label: string;
    url?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    if (!items || items.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className={classNames('flex', className)}>
            <motion.ol
                className="flex items-center space-x-2"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.2
                        }
                    }
                }}
            >
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <Fragment key={`${item.label}-${index}`}>
                            {index > 0 && (
                                <motion.li
                                    aria-hidden="true"
                                    variants={{
                                        hidden: { opacity: 0, x: -10 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                    className="text-black dark:text-white shrink-0"
                                >
                                    <ArrowRightIcon className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                </motion.li>
                            )}
                            <motion.li
                                variants={{
                                    hidden: { opacity: 0, x: -10 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                                className="flex items-center"
                            >
                                {item.url && !isLast ? (
                                    <Link
                                        href={item.url}
                                        className="text-sm md:text-base font-medium text-gray-500 hover:text-[var(--theme-primary)] dark:text-gray-400 dark:hover:text-[var(--theme-primary)] transition-colors line-clamp-1 max-w-[100px] sm:max-w-none"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={classNames(
                                            "text-sm md:text-base font-medium line-clamp-1",
                                            isLast ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                                        )}
                                        aria-current={isLast ? 'page' : undefined}
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </motion.li>
                        </Fragment>
                    );
                })}
            </motion.ol>
        </nav>
    );
}
