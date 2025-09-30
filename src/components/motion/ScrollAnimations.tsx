import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface FadeInProps {
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

export const FadeIn: React.FC<FadeInProps> = ({
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
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
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
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
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
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem: React.FC<{ children: ReactNode; className?: string }> = ({
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
            className={className}
        >
            {children}
        </motion.div>
    );
};