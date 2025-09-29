import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HoverLiftProps {
    children: ReactNode;
    className?: string;
    liftHeight?: number;
}

export const HoverLift: React.FC<HoverLiftProps> = ({
    children,
    className = '',
    liftHeight = -5
}) => {
    return (
        <motion.div
            whileHover={{
                y: liftHeight,
                transition: { duration: 0.2, ease: "easeOut" }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface HoverScaleProps {
    children: ReactNode;
    className?: string;
    scale?: number;
}

export const HoverScale: React.FC<HoverScaleProps> = ({
    children,
    className = '',
    scale = 1.05
}) => {
    return (
        <motion.div
            whileHover={{
                scale,
                transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.95 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface FloatingElementProps {
    children: ReactNode;
    className?: string;
    amplitude?: number;
    duration?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
    children,
    className = '',
    amplitude = 10,
    duration = 3
}) => {
    return (
        <motion.div
            animate={{
                y: [0, -amplitude, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface PulseProps {
    children: ReactNode;
    className?: string;
    scale?: number;
    duration?: number;
}

export const Pulse: React.FC<PulseProps> = ({
    children,
    className = '',
    scale = 1.05,
    duration = 2
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
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface RotateOnHoverProps {
    children: ReactNode;
    className?: string;
    rotation?: number;
}

export const RotateOnHover: React.FC<RotateOnHoverProps> = ({
    children,
    className = '',
    rotation = 360
}) => {
    return (
        <motion.div
            whileHover={{
                rotate: rotation,
                transition: { duration: 0.3, ease: "easeInOut" }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface SlideInProps {
    children: ReactNode;
    className?: string;
    direction?: 'left' | 'right' | 'up' | 'down';
    distance?: number;
}

export const SlideIn: React.FC<SlideInProps> = ({
    children,
    className = '',
    direction = 'left',
    distance = 50
}) => {
    const getInitialPosition = () => {
        switch (direction) {
            case 'left': return { x: -distance };
            case 'right': return { x: distance };
            case 'up': return { y: -distance };
            case 'down': return { y: distance };
            default: return { x: -distance };
        }
    };

    return (
        <motion.div
            initial={{ ...getInitialPosition(), opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface ButtonAnimationProps {
    children: ReactNode;
    className?: string;
    variant?: 'bounce' | 'scale' | 'shake';
}

export const ButtonAnimation: React.FC<ButtonAnimationProps> = ({
    children,
    className = '',
    variant = 'scale'
}) => {
    const getAnimation = () => {
        switch (variant) {
            case 'bounce':
                return {
                    whileHover: { y: -2 },
                    whileTap: { y: 1, scale: 0.98 }
                };
            case 'shake':
                return {
                    whileHover: { x: [0, -2, 2, -2, 2, 0] },
                    whileTap: { scale: 0.95 }
                };
            case 'scale':
            default:
                return {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 }
                };
        }
    };

    return (
        <motion.div
            {...getAnimation()}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};