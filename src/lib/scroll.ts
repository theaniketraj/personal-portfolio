/**
 * Checks whether the user has requested reduced motion via prefers-reduced-motion media query.
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Returns 'auto' if the user prefers reduced motion, or the requested behavior ('smooth' by default).
 */
export function getScrollBehavior(preferred: ScrollBehavior = 'smooth'): ScrollBehavior {
    return prefersReducedMotion() ? 'auto' : preferred;
}

/**
 * Scrolls the window to top respecting reduced motion preferences.
 */
export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    if (typeof window === 'undefined') return;

    window.scrollTo({
        top: 0,
        behavior: getScrollBehavior(behavior)
    });
}

/**
 * Scrolls an element by offset respecting reduced motion preferences.
 */
export function scrollElementBy(element: HTMLElement | null | undefined, options: ScrollToOptions): void {
    if (!element) return;

    element.scrollBy({
        ...options,
        behavior: getScrollBehavior(options.behavior)
    });
}

/**
 * Scrolls an element into view respecting reduced motion preferences.
 */
export function scrollElementIntoView(element: Element | null | undefined, options?: ScrollIntoViewOptions): void {
    if (!element) return;

    element.scrollIntoView({
        ...options,
        behavior: getScrollBehavior(options?.behavior)
    });
}
