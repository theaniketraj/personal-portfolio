import React, { ReactNode } from 'react';
import { useHardwareAcceleration, useReducedMotion, useScrollAnimation } from '../../hooks/useHardwareAnimations';

interface HardwareAnimatedProps {
    children: ReactNode;
    animation?: 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'fadeInScale' | 'fadeInRotate';
    delay?: number;
    className?: string;
    threshold?: number;
    triggerOnce?: boolean;
}

export const HardwareAnimated: React.FC<HardwareAnimatedProps> = ({
    children,
    animation = 'slideInUp',
    delay = 0,
    className = '',
    threshold = 0.1,
    triggerOnce = true
}) => {
    const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold, triggerOnce });
    const hardwareRef = useHardwareAcceleration<HTMLDivElement>();
    const prefersReducedMotion = useReducedMotion();

    // Combine refs
    const combinedRef = (node: HTMLDivElement | null) => {
        if (node) {
            if (elementRef) elementRef.current = node;
            if (hardwareRef) hardwareRef.current = node;
        }
    };

    const animationClass = prefersReducedMotion ? '' : `animate-${animation}`;
    const staggerClass = delay > 0 ? `stagger-medium-${Math.min(Math.ceil(delay / 0.1), 6)}` : '';

    return (
        <div
            ref={combinedRef}
            className={`
                gpu-accelerated
                performance-layer
                ${isVisible ? animationClass : ''}
                ${staggerClass}
                ${className}
            `.trim()}
            style={{
                animationDelay: `${delay}s`,
            }}
        >
            {children}
        </div>
    );
};

interface StaggeredContainerProps {
    children: ReactNode;
    className?: string;
    itemDelay?: number;
    animation?: 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'fadeInScale';
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
    children,
    className = '',
    itemDelay = 0.1,
    animation = 'slideInUp'
}) => {
    const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>();
    const prefersReducedMotion = useReducedMotion();

    return (
        <div ref={elementRef} className={`${className}`}>
            {React.Children.map(children, (child, index) => {
                // Generate a more unique key
                const childKey = React.isValidElement(child) && child.key
                    ? `${child.key}-${index}`
                    : `stagger-item-${Date.now()}-${index}`;

                return (
                    <HardwareAnimated
                        key={childKey}
                        animation={animation}
                        delay={isVisible && !prefersReducedMotion ? index * itemDelay : 0}
                    >
                        {child}
                    </HardwareAnimated>
                );
            })}
        </div>
    );
};

interface HoverEffectProps {
    children: ReactNode;
    effect?: 'lift' | 'scale' | 'rotate' | 'glow';
    className?: string;
}

export const HoverEffect: React.FC<HoverEffectProps> = ({
    children,
    effect = 'lift',
    className = ''
}) => {
    const hardwareRef = useHardwareAcceleration<HTMLDivElement>();
    const prefersReducedMotion = useReducedMotion();

    const effectClass = prefersReducedMotion ? '' : `hover-${effect}`;

    return (
        <div
            ref={hardwareRef}
            className={`
                gpu-accelerated
                performance-layer
                ${effectClass}
                ${className}
            `.trim()}
        >
            {children}
        </div>
    );
};

interface LoadingSkeletonProps {
    width?: string;
    height?: string;
    className?: string;
    variant?: 'shimmer' | 'pulse';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    width = '100%',
    height = '20px',
    className = '',
    variant = 'shimmer'
}) => {
    const hardwareRef = useHardwareAcceleration<HTMLDivElement>();
    const prefersReducedMotion = useReducedMotion();

    const animationClass = prefersReducedMotion ? 'bg-gray-200' : getAnimationClass(variant);

    function getAnimationClass(variant: 'shimmer' | 'pulse'): string {
        if (variant === 'shimmer') return 'shimmer-loading';
        return 'skeleton-pulse';
    }

    return (
        <div
            ref={hardwareRef}
            className={`
                gpu-accelerated
                performance-layer
                ${animationClass}
                rounded
                ${className}
            `.trim()}
            style={{ width, height }}
        />
    );
};

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    skeleton?: boolean;
    skeletonHeight?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    skeleton = true,
    skeletonHeight = '200px',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const hardwareRef = useHardwareAcceleration<HTMLImageElement>();

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setIsError(true);
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {skeleton && !isLoaded && !isError && (
                <LoadingSkeleton
                    width="100%"
                    height={skeletonHeight}
                    className="absolute inset-0"
                />
            )}
            <img
                ref={hardwareRef}
                src={src}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                className={`
                    gpu-accelerated
                    performance-layer
                    image-fade-in
                    ${isLoaded ? 'loaded' : ''}
                    transition-opacity duration-600
                `.trim()}
                {...props}
            />
        </div>
    );
};

interface ParallaxSectionProps {
    children: ReactNode;
    speed?: number;
    className?: string;
    enableOnMobile?: boolean;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
    children,
    speed = 0.5,
    className = '',
    enableOnMobile = false
}) => {
    const [offset, setOffset] = React.useState(0);
    const elementRef = React.useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    React.useEffect(() => {
        if (prefersReducedMotion) return;

        let animationFrameId: number;
        const isMobile = window.innerWidth <= 768;

        if (isMobile && !enableOnMobile) return;

        const handleScroll = () => {
            animationFrameId = requestAnimationFrame(() => {
                if (elementRef.current) {
                    const rect = elementRef.current.getBoundingClientRect();
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * speed;

                    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                        setOffset(rate);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [speed, enableOnMobile, prefersReducedMotion]);

    return (
        <div
            ref={elementRef}
            className={`
                parallax-optimized
                performance-layer
                ${className}
            `.trim()}
            style={{
                transform: prefersReducedMotion ? 'none' : `translate3d(0, ${offset}px, 0)`,
            }}
        >
            {children}
        </div>
    );
};

interface AnimatedCounterProps {
    target: number;
    duration?: number;
    className?: string;
    suffix?: string;
    prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    target,
    duration = 2000,
    className = '',
    suffix = '',
    prefix = ''
}) => {
    const [count, setCount] = React.useState(0);
    const { elementRef, isVisible } = useScrollAnimation<HTMLSpanElement>({ triggerOnce: true });
    const prefersReducedMotion = useReducedMotion();

    React.useEffect(() => {
        if (!isVisible || prefersReducedMotion) {
            setCount(target);
            return;
        }

        let startTime: number;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(target * easeOutQuart));

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isVisible, target, duration, prefersReducedMotion]);

    return (
        <span ref={elementRef} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
};