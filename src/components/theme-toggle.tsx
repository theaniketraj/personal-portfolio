'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { flushSync } from 'react-dom';
import { Sun, Moon } from 'lucide-react';

interface ViewTransition {
    ready: Promise<void>;
    finished: Promise<void>;
}

type DocumentWithViewTransition = Document & {
    startViewTransition?: (callback: () => Promise<void> | void) => ViewTransition;
};

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const isTransitioningRef = React.useRef(false);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                aria-hidden="true"
                className="w-9.5 h-9.5 sm:w-11.5 sm:h-11.5 rounded-full border border-primary/10 flex items-center justify-center p-2.5 opacity-50"
            />
        );
    }

    const currentTheme = resolvedTheme || theme || 'dark';
    const isDark = currentTheme === 'dark';

    const toggleTheme = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const nextTheme = isDark ? 'light' : 'dark';

        if (isTransitioningRef.current) {
            return;
        }

        const doc = typeof document !== 'undefined' ? (document as DocumentWithViewTransition) : null;
        const prefersReducedMotion =
            typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Fallback to instantaneous theme switch if View Transitions are unsupported or reduced motion is preferred
        if (!doc || typeof doc.startViewTransition !== 'function' || prefersReducedMotion) {
            setTheme(nextTheme);
            return;
        }

        const button = buttonRef.current;
        let x: number;
        let y: number;

        if (button) {
            const rect = button.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        } else {
            x = event.clientX;
            y = event.clientY;
        }

        // Calculate maximum radius required to cover the entire viewport from (x, y)
        const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        isTransitioningRef.current = true;

        try {
            const transition = doc.startViewTransition(() => {
                try {
                    flushSync(() => {
                        setTheme(nextTheme);
                    });
                } catch {
                    setTheme(nextTheme);
                }
            });

            transition.ready
                .then(() => {
                    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

                    document.documentElement.animate(
                        {
                            clipPath
                        },
                        {
                            duration: 450,
                            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                            pseudoElement: '::view-transition-new(root)'
                        }
                    );
                })
                .catch(() => {});

            await transition.finished.finally(() => {
                isTransitioningRef.current = false;
            });
        } catch {
            isTransitioningRef.current = false;
            setTheme(nextTheme);
        }
    };

    return (
        <button
            ref={buttonRef}
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9.5 h-9.5 sm:w-11.5 sm:h-11.5 flex items-center justify-center hover:bg-primary/5 border border-primary/10 rounded-full transition-all duration-200 active:scale-95 cursor-pointer text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative overflow-hidden group"
        >
            <Sun
                className={`w-5.5 h-5.5 sm:w-6 sm:h-6 text-amber-400 transition-all duration-500 ease-in-out transform ${
                    isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                }`}
                aria-hidden="true"
            />
            <Moon
                className={`w-5.5 h-5.5 sm:w-6 sm:h-6 text-primary transition-all duration-500 ease-in-out transform absolute ${
                    isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`}
                aria-hidden="true"
            />
        </button>
    );
}
