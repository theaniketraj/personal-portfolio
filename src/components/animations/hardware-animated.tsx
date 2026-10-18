'use client';
import React, { ReactNode } from 'react';
import { useHardwareAcceleration, useReducedMotion, useScrollAnimation } from '@/hooks/use-hardware-animations';

export type AnimationType =
    | 'slideInUp'
    | 'slideInDown'
    | 'slideInLeft'
    | 'slideInRight'
    | 'fadeInScale'
    | 'fadeInRotate';

interface HardwareAnimatedProps {
    children: ReactNode;
    animation?: AnimationType;
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
    const { elementRef, isVisible, isReady } = useScrollAnimation<HTMLDivElement>({
        threshold,
        triggerOnce
    });
    const hardwareRef = useHardwareAcceleration<HTMLDivElement>();
    const prefersReducedMotion = useReducedMotion();

    const combinedRef = (node: HTMLDivElement | null) => {
        if (node) {
            if (elementRef) elementRef.current = node;
            if (hardwareRef) hardwareRef.current = node;
        }
    };

    // Keep content visible by default; only apply pre-animation hidden state
    // once the client has confirmed observation and animations are enabled.
    const canAnimate = isReady && !prefersReducedMotion;
    const animationClass = canAnimate ? (isVisible ? `animate-${animation}` : 'opacity-0') : '';

    return (
        <div
            ref={combinedRef}
            className={`gpu-accelerated performance-layer ${animationClass} ${className}`.trim()}
            style={{
                animationDelay: canAnimate && isVisible ? `${delay}s` : undefined
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
    animation?: AnimationType;
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
    children,
    className = '',
    itemDelay = 0.1,
    animation = 'slideInUp'
}) => {
    const { elementRef, isVisible, isReady } = useScrollAnimation<HTMLDivElement>();
    const prefersReducedMotion = useReducedMotion();
    const canAnimate = isReady && !prefersReducedMotion;

    return (
        <div ref={elementRef} className={className}>
            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return child;
                return (
                    <HardwareAnimated
                        key={child.key ?? `stagger-${index}`}
                        animation={animation}
                        delay={canAnimate && isVisible ? index * itemDelay : 0}
                    >
                        {child}
                    </HardwareAnimated>
                );
            })}
        </div>
    );
};
