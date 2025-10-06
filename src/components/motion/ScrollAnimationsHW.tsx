import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface FadeInHWProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
}

const variants = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 },
};

export const FadeInHW: React.FC<FadeInHWProps> = ({
    children,
    delay = 0,
    direction = 'up',
    className = ''
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-100px"
    });

    return (
        <motion.div
            ref={ref}
            initial={variants[direction]}
            animate={isInView ? { x: 0, y: 0, opacity: 1 } : variants[direction]}
            transition={{
                duration: 0.6,
                delay,
                ease: "easeOut"
            }}
            className={`gpu-accelerated ${className}`}
            style={{
                transform: 'translateZ(0)',
                willChange: 'transform, opacity'
            }}
        >
            {children}
        </motion.div>
    );
};

interface ScrollRevealHWProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export const ScrollRevealHW: React.FC<ScrollRevealHWProps> = ({
    children,
    delay = 0,
    className = ''
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-50px"
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{
                duration: 0.8,
                delay,
                ease: "easeOut"
            }}
            className={`gpu-accelerated ${className}`}
            style={{
                transform: 'translateZ(0)',
                willChange: 'transform, opacity'
            }}
        >
            {children}
        </motion.div>
    );
};

interface StaggerContainerHWProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

export const StaggerContainerHW: React.FC<StaggerContainerHWProps> = ({
    children,
    className = '',
    staggerDelay = 0.1
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-100px"
    });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
            className={`performance-layer ${className}`}
            style={{
                transform: 'translateZ(0)',
                willChange: 'transform'
            }}
        >
            {children}
        </motion.div>
    );
};

interface StaggerItemHWProps {
    children: ReactNode;
    className?: string;
}

export const StaggerItemHW: React.FC<StaggerItemHWProps> = ({
    children,
    className = ''
}) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`gpu-accelerated ${className}`}
            style={{
                transform: 'translateZ(0)',
                willChange: 'transform, opacity'
            }}
        >
            {children}
        </motion.div>
    );
};

// Advanced hardware-accelerated animations
export const SlideInHW: React.FC<{
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    className?: string;
}> = ({
    children,
    direction = 'up',
    delay = 0,
    className = ''
}) => {
        const ref = useRef(null);
        const isInView = useInView(ref, {
            once: true,
            margin: "-100px"
        });

        const slideVariants = {
            up: { y: 100, opacity: 0, scale: 0.95 },
            down: { y: -100, opacity: 0, scale: 0.95 },
            left: { x: 100, opacity: 0, scale: 0.95 },
            right: { x: -100, opacity: 0, scale: 0.95 },
        };

        return (
            <motion.div
                ref={ref}
                initial={slideVariants[direction]}
                animate={isInView ? { x: 0, y: 0, opacity: 1, scale: 1 } : slideVariants[direction]}
                transition={{
                    duration: 0.6,
                    delay,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={`gpu-accelerated ${className}`}
                style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform, opacity'
                }}
            >
                {children}
            </motion.div>
        );
    };

export const FadeScaleHW: React.FC<{
    children: ReactNode;
    delay?: number;
    className?: string;
}> = ({
    children,
    delay = 0,
    className = ''
}) => {
        const ref = useRef(null);
        const isInView = useInView(ref, {
            once: true,
            margin: "-100px"
        });

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
                animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.8, rotateY: -10 }}
                transition={{
                    duration: 0.8,
                    delay,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={`gpu-accelerated ${className}`}
                style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform, opacity',
                    perspective: '1000px'
                }}
            >
                {children}
            </motion.div>
        );
    };

export const ParallaxHW: React.FC<{
    children: ReactNode;
    speed?: number;
    className?: string;
}> = ({
    children,
    speed = 0.5,
    className = ''
}) => {
        const ref = useRef(null);
        const { scrollYProgress } = useScroll({
            target: ref,
            offset: ["start end", "end start"]
        });

        const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

        return (
            <motion.div
                ref={ref}
                style={{ y }}
                className={`performance-layer ${className}`}
                // Force hardware acceleration
                initial={{ transform: 'translateZ(0)' }}
            >
                {children}
            </motion.div>
        );
    };

// Hover animations with hardware acceleration
export const HoverLiftHW: React.FC<{
    children: ReactNode;
    className?: string;
}> = ({
    children,
    className = ''
}) => {
        return (
            <motion.div
                whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                className={`gpu-accelerated ${className}`}
                style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                }}
            >
                {children}
            </motion.div>
        );
    };

export const HoverScaleHW: React.FC<{
    children: ReactNode;
    scale?: number;
    className?: string;
}> = ({
    children,
    scale = 1.05,
    className = ''
}) => {
        return (
            <motion.div
                whileHover={{
                    scale,
                    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                className={`gpu-accelerated ${className}`}
                style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                }}
            >
                {children}
            </motion.div>
        );
    };

export const HoverRotateHW: React.FC<{
    children: ReactNode;
    degrees?: number;
    className?: string;
}> = ({
    children,
    degrees = 5,
    className = ''
}) => {
        return (
            <motion.div
                whileHover={{
                    rotate: degrees,
                    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                className={`gpu-accelerated ${className}`}
                style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                }}
            >
                {children}
            </motion.div>
        );
    };

// Continuous animations
export const FloatHW: React.FC<{
    children: ReactNode;
    amplitude?: number;
    duration?: number;
    className?: string;
}> = ({
    children,
    amplitude = 10,
    duration = 3,
    className = ''
}) => {
        return (
            <motion.div
                animate={{
                    y: [-amplitude / 2, amplitude / 2, -amplitude / 2],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`gpu-accelerated ${className}`}
                style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                }}
            >
                {children}
            </motion.div>
        );
    };

export const PulseHW: React.FC<{
    children: ReactNode;
    scale?: number;
    duration?: number;
    className?: string;
}> = ({
    children,
    scale = 1.05,
    duration = 2,
    className = ''
}) => {
        return (
            <motion.div
                animate={{
                    scale: [1, scale, 1],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`gpu-accelerated ${className}`}
                style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                }}
            >
                {children}
            </motion.div>
        );
    };