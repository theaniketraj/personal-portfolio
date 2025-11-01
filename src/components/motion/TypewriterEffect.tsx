import { motion } from 'framer-motion';
import { ReactNode, useMemo } from 'react';

interface TypewriterEffectProps {
    children: ReactNode;
    delay?: number;
    speed?: 'slow' | 'medium' | 'fast';
    className?: string;
}

// Speed configurations (duration per character in milliseconds)
const speedConfig = {
    slow: 0.08,
    medium: 0.05,
    fast: 0.03
};

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
    children,
    delay = 0,
    speed = 'medium',
    className = ''
}) => {
    // Extract text from children
    const text = useMemo(() => {
        if (typeof children === 'string') {
            return children;
        }
        if (typeof children === 'number') {
            return String(children);
        }
        // Handle React elements - extract visible text
        if (children && typeof children === 'object' && 'props' in children) {
            return extractText(children);
        }
        return '';
    }, [children]);

    const characters = text.split('');
    const duration = speedConfig[speed];
    const totalDuration = characters.length * duration;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: duration,
                delayChildren: delay
            }
        }
    };

    const charVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.01
            }
        }
    };

    return (
        <motion.span className={className} initial="hidden" animate="visible" variants={containerVariants}>
            {characters.map((char, index) => (
                <motion.span key={`${index}-${char}`} variants={charVariants}>
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

// Helper function to extract text from React elements
function extractText(element: any): string {
    if (typeof element === 'string') return element;
    if (typeof element === 'number') return String(element);

    if (Array.isArray(element)) {
        return element.map((el) => extractText(el)).join('');
    }

    if (element?.props?.children) {
        if (Array.isArray(element.props.children)) {
            return element.props.children.map((child) => extractText(child)).join('');
        }
        return extractText(element.props.children);
    }

    return '';
}
