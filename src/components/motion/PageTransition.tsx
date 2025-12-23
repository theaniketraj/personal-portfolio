import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
    out: {
        opacity: 0,
        y: -20,
        scale: 1.02,
    },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const router = useRouter();

    return (
        <AnimatePresence
            mode="wait"
            initial={false}
            onExitComplete={() => window.scrollTo(0, 0)}
        >
            <motion.div
                key={router.asPath}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={{
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1.0] // Ease-in-out cubic-like
                }}
                className="min-h-screen"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};