import { useCallback, useEffect, useRef, useState } from 'react';

// Hardware-accelerated animation hooks
export const useHardwareAcceleration = <T extends HTMLElement>() => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (ref.current) {
            // Force GPU acceleration
            ref.current.style.transform = 'translateZ(0)';
            ref.current.style.backfaceVisibility = 'hidden';
            ref.current.style.perspective = '1000px';
            ref.current.style.willChange = 'transform, opacity';
        }
    }, []);

    return ref;
};

// Intersection Observer hook for scroll animations
export const useScrollAnimation = <T extends HTMLElement>(options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const elementRef = useRef<T>(null);

    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '-50px 0px',
        triggerOnce: true,
        ...options
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (defaultOptions.triggerOnce && !hasAnimated) {
                        setHasAnimated(true);
                    }
                } else if (!defaultOptions.triggerOnce) {
                    setIsVisible(false);
                }
            },
            {
                threshold: defaultOptions.threshold,
                rootMargin: defaultOptions.rootMargin
            }
        );

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [defaultOptions.threshold, defaultOptions.rootMargin, defaultOptions.triggerOnce, hasAnimated]);

    return { elementRef, isVisible, hasAnimated };
};

// Optimized parallax hook
export const useOptimizedParallax = (speed = 0.5, enableOnMobile = false) => {
    const [offset, setOffset] = useState(0);
    const elementRef = useRef<HTMLElement>(null);
    const requestRef = useRef<number | null>(null);
    const previousTimeRef = useRef<number | null>(null);

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    const animate = useCallback(
        (time: number) => {
            if (previousTimeRef.current !== undefined) {
                if (!isMobile || enableOnMobile) {
                    const scrollY = window.pageYOffset;
                    if (elementRef.current) {
                        const rect = elementRef.current.getBoundingClientRect();
                        const elementTop = rect.top + scrollY;
                        const windowHeight = window.innerHeight;

                        // Only calculate parallax when element is near viewport
                        if (rect.bottom >= 0 && rect.top <= windowHeight) {
                            const yPos = -(scrollY - elementTop) * speed;
                            setOffset(yPos);
                        }
                    }
                }
            }
            previousTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        },
        [speed, isMobile, enableOnMobile]
    );

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [animate]);

    const style = {
        transform: `translate3d(0, ${offset}px, 0)`,
        willChange: 'transform'
    };

    return { elementRef, style };
};

// Performance-optimized hover animation
export const useHoverAnimation = (config = {}) => {
    const [isHovered, setIsHovered] = useState(false);
    const elementRef = useRef<HTMLElement>(null);

    const defaultConfig = {
        scale: 1.05,
        translateY: -8,
        duration: 300,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        ...config
    };

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Apply hardware acceleration
        element.style.transform = 'translateZ(0)';
        element.style.transition = `transform ${defaultConfig.duration}ms ${defaultConfig.easing}`;

        const handleMouseEnter = () => {
            setIsHovered(true);
            const transform = `translate3d(0, ${defaultConfig.translateY}px, 0) scale3d(${defaultConfig.scale}, ${defaultConfig.scale}, 1)`;
            element.style.transform = transform;
        };

        const handleMouseLeave = () => {
            setIsHovered(false);
            element.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1)';
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [defaultConfig.scale, defaultConfig.translateY, defaultConfig.duration, defaultConfig.easing]);

    return { elementRef, isHovered };
};

// Staggered animation hook
export const useStaggeredAnimation = (itemCount: number, delay = 100) => {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const triggerStaggeredAnimation = () => {
            for (let i = 0; i < itemCount; i++) {
                setTimeout(() => {
                    setVisibleItems((prev) => new Set([...prev, i]));
                }, i * delay);
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    triggerStaggeredAnimation();
                }
            },
            { threshold: 0.1, rootMargin: '-50px 0px' }
        );

        const currentContainer = containerRef.current;
        if (currentContainer) {
            observer.observe(currentContainer);
        }

        return () => {
            if (currentContainer) {
                observer.unobserve(currentContainer);
            }
        };
    }, [itemCount, delay]);

    return { containerRef, visibleItems };
};

// Image loading optimization hook
export const useOptimizedImageLoading = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const image = imageRef.current;
        if (!image) return;

        const handleLoad = () => {
            setIsLoaded(true);
            // Add hardware acceleration classes
            image.classList.add('gpu-accelerated', 'image-fade-in', 'loaded');
        };

        const handleError = () => {
            setIsError(true);
        };

        if (image.complete) {
            handleLoad();
        } else {
            image.addEventListener('load', handleLoad);
            image.addEventListener('error', handleError);
        }

        return () => {
            image.removeEventListener('load', handleLoad);
            image.removeEventListener('error', handleError);
        };
    }, []);

    return { imageRef, isLoaded, isError };
};

// Reduced motion detection
export const useReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return prefersReducedMotion;
};

// Performance monitoring hook
export const useAnimationPerformance = () => {
    const [fps, setFps] = useState(60);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());

    useEffect(() => {
        let animationFrameId: number;

        const measureFPS = () => {
            frameCountRef.current++;
            const now = performance.now();

            if (now - lastTimeRef.current >= 1000) {
                setFps(frameCountRef.current);
                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }

            animationFrameId = requestAnimationFrame(measureFPS);
        };

        animationFrameId = requestAnimationFrame(measureFPS);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return { fps, isLowPerformance: fps < 30 };
};
