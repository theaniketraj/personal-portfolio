import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxSectionProps {
    children: ReactNode;
    speed?: number;
    className?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
    children,
    speed = 0.5,
    className = ''
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    return (
        <motion.div
            ref={ref}
            style={{ y: smoothY }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface ParallaxImageProps {
    src: string;
    alt: string;
    speed?: number;
    className?: string;
    overlay?: boolean;
    overlayOpacity?: number;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
    src,
    alt,
    speed = 0.3,
    className = '',
    overlay = false,
    overlayOpacity = 0.4
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-speed * 100, speed * 100]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 0.95]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
    const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div
                style={{
                    y: smoothY,
                    scale: smoothScale
                }}
                className="w-full h-full"
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                />
                {overlay && (
                    <div
                        className="absolute inset-0 bg-black"
                        style={{ opacity: overlayOpacity }}
                    />
                )}
            </motion.div>
        </div>
    );
};

interface ParallaxTextProps {
    children: ReactNode;
    speed?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({
    children,
    speed = 0.2,
    direction = 'up',
    className = ''
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const distance = speed * 100;

    // Calculate transform values based on direction
    const upTransform: [number, number] = [distance, -distance];
    const downTransform: [number, number] = [-distance, distance];
    const leftTransform: [number, number] = [distance, -distance];
    const rightTransform: [number, number] = [-distance, distance];

    let transformValues: [number, number];
    switch (direction) {
        case 'down':
            transformValues = downTransform;
            break;
        case 'left':
            transformValues = leftTransform;
            break;
        case 'right':
            transformValues = rightTransform;
            break;
        default:
            transformValues = upTransform;
            break;
    }

    const transform = useTransform(scrollYProgress, [0, 1], transformValues);
    const smoothTransform = useSpring(transform, { stiffness: 100, damping: 30 });

    const motionProps = direction === 'left' || direction === 'right'
        ? { x: smoothTransform }
        : { y: smoothTransform };

    return (
        <motion.div
            ref={ref}
            style={motionProps}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface ScrollBasedScaleProps {
    children: ReactNode;
    scaleRange?: [number, number];
    className?: string;
}

export const ScrollBasedScale: React.FC<ScrollBasedScaleProps> = ({
    children,
    scaleRange = [0.8, 1.2],
    className = ''
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleRange[0], 1, scaleRange[1]]);
    const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

    return (
        <motion.div
            ref={ref}
            style={{ scale: smoothScale }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface ParallaxBackgroundProps {
    children: ReactNode;
    backgroundImage?: string;
    speed?: number;
    overlay?: boolean;
    overlayColor?: string;
    overlayOpacity?: number;
    className?: string;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
    children,
    backgroundImage,
    speed = 0.5,
    overlay = false,
    overlayColor = 'black',
    overlayOpacity = 0.3,
    className = ''
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            {backgroundImage && (
                <motion.div
                    style={{ y: smoothY }}
                    className="absolute inset-0 w-full h-full"
                >
                    <div
                        className="w-full h-[120%] bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            marginTop: '-10%'
                        }}
                    />
                    {overlay && (
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: overlayColor,
                                opacity: overlayOpacity
                            }}
                        />
                    )}
                </motion.div>
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

interface TiltParallaxProps {
    children: ReactNode;
    tiltRange?: number;
    className?: string;
}

export const TiltParallax: React.FC<TiltParallaxProps> = ({
    children,
    tiltRange = 5,
    className = ''
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const rotateX = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [tiltRange, 0, -tiltRange]
    );
    const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });

    return (
        <motion.div
            ref={ref}
            style={{
                rotateX: smoothRotateX,
                transformPerspective: '1000px'
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};