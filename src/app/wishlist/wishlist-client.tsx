'use client';

import { useState, useMemo } from 'react';
import {
    Monitor,
    Keyboard,
    Headphones,
    Armchair,
    BookOpen,
    ArrowUpRight,
    Package,
    SlidersHorizontal
} from 'lucide-react';
import { WishlistItem } from '@/lib/content/types';
import { HardwareAnimated } from '@/components/animations/hardware-animated';

interface WishlistClientProps {
    items: WishlistItem[];
}

export function WishlistClient({ items }: Readonly<WishlistClientProps>) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = Array.from(new Set(items.map((i) => i.category.toLowerCase())));
        return ['all', ...cats];
    }, [items]);

    const filteredItems = useMemo(() => {
        if (selectedCategory === 'all') return items;
        return items.filter((item) => item.category.toLowerCase() === selectedCategory);
    }, [items, selectedCategory]);

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'tech':
                return <Monitor className="w-3.5 h-3.5" aria-hidden="true" />;
            case 'peripherals':
                return <Keyboard className="w-3.5 h-3.5" aria-hidden="true" />;
            case 'audio':
                return <Headphones className="w-3.5 h-3.5" aria-hidden="true" />;
            case 'workspace':
                return <Armchair className="w-3.5 h-3.5" aria-hidden="true" />;
            case 'books':
                return <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />;
            default:
                return <Package className="w-3.5 h-3.5" aria-hidden="true" />;
        }
    };

    return (
        <div>
            {/* Filter Pills Toolbar */}
            <div className="border-t border-primary/10 bg-primary/2">
                <div className="max-w-3xl mx-auto px-4 sm:px-7 py-4 sm:py-5 flex flex-wrap items-center gap-4">
                    <fieldset className="m-0 p-0 border-none min-w-0 flex flex-wrap items-center gap-2">
                        <legend className="sr-only">Filter wishlist by category</legend>
                        <span className="text-xs font-mono text-secondary mr-1 hidden sm:inline-flex items-center gap-1.5 cursor-default select-none">
                            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                            Filter:
                        </span>
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat;

                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                        isSelected
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-background hover:bg-primary/5 text-secondary hover:text-primary border border-primary/10'
                                    }`}
                                >
                                    {cat !== 'all' && getCategoryIcon(cat)}
                                    <span className="capitalize">{cat}</span>
                                </button>
                            );
                        })}
                    </fieldset>
                </div>
            </div>

            {/* Wishlist List Layout (Matching /blog feed style) */}
            <div className="border-t border-primary/10">
                <div className="max-w-3xl mx-auto px-4 sm:px-7 py-10 flex flex-col gap-8">
                    {filteredItems.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-secondary text-base">No items found in this category.</p>
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('all')}
                                className="mt-4 text-xs font-mono uppercase tracking-wider text-primary hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xs"
                            >
                                Reset Filter
                            </button>
                        </div>
                    ) : (
                        filteredItems.map((item, index) => (
                            <HardwareAnimated key={item.title} animation="slideInUp" delay={index * 0.08}>
                                <article
                                    className={`group ${index !== filteredItems.length - 1 ? 'border-b border-primary/15 pb-10' : ''}`}
                                >
                                    {/* Title & Category Chip Row */}
                                    <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
                                        {item.link ? (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                                            >
                                                <h2 className="text-xl sm:text-2xl font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                    {item.title}
                                                </h2>
                                            </a>
                                        ) : (
                                            <h2 className="text-xl sm:text-2xl font-medium text-primary">
                                                {item.title}
                                            </h2>
                                        )}

                                        {/* Category Chip */}
                                        <span className="text-xs font-mono text-secondary border border-primary/10 rounded-md px-2.5 py-0.5 capitalize inline-flex items-center gap-1.5 cursor-default bg-background/50 shrink-0">
                                            {getCategoryIcon(item.category)}
                                            <span>{item.category}</span>
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-secondary text-sm sm:text-base leading-relaxed mb-5 cursor-default">
                                        {item.description}
                                    </p>

                                    {/* External Link Action */}
                                    {item.link && (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer nofollow"
                                            aria-label={`View details for ${item.title}`}
                                            className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                                        >
                                            <span>View Details</span>
                                            <span className="relative flex items-center justify-center overflow-hidden w-4.5 h-4.5">
                                                <ArrowUpRight
                                                    className="absolute w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-full group-hover:-translate-y-full"
                                                    aria-hidden="true"
                                                />
                                                <ArrowUpRight
                                                    className="absolute w-4.5 h-4.5 -translate-x-full translate-y-full transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </a>
                                    )}
                                </article>
                            </HardwareAnimated>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
