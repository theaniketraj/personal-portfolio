import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    circle?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    width = '100%',
    height = '20px',
    className = '',
    circle = false
}) => {
    const shimmerAnimation = {
        initial: { backgroundPosition: '200% 0' },
        animate: { backgroundPosition: '-200% 0' },
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
        }
    };

    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const heightStyle = typeof height === 'number' ? `${height}px` : height;

    return (
        <motion.div
            className={`${circle ? 'rounded-full' : 'rounded'} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${className}`}
            style={{
                width: widthStyle,
                height: heightStyle,
                backgroundSize: '200% 100%',
                backgroundPosition: '200% 0'
            }}
            variants={shimmerAnimation}
            initial="initial"
            animate="animate"
        />
    );
};

export const SkeletonPulse: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <motion.div
            className={`rounded bg-gray-200 ${className}`}
            animate={{
                opacity: [0.5, 1, 0.5]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
        />
    );
};
