import { useCallback, useEffect, useRef, useState } from "react";

// Hardware-accelerated GPU layer promotion hook
export const useHardwareAcceleration = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = "translateZ(0)";
      ref.current.style.backfaceVisibility = "hidden";
      ref.current.style.perspective = "1000px";
      ref.current.style.willChange = "transform, opacity";
    }
  }, []);

  return ref;
};

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Intersection Observer hook for hardware-accelerated scroll animations
export const useScrollAnimation = <T extends HTMLElement>(
  options: ScrollAnimationOptions = {},
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<T>(null);

  const threshold = options.threshold ?? 0.1;
  const rootMargin = options.rootMargin ?? "-50px 0px";
  const triggerOnce = options.triggerOnce ?? true;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && !hasAnimated) {
            setHasAnimated(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
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
  }, [threshold, rootMargin, triggerOnce, hasAnimated]);

  return { elementRef, isVisible, hasAnimated };
};

// Optimized Parallax Scrolling Hook
export const useOptimizedParallax = (speed = 0.5, enableOnMobile = false) => {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLElement>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const animate = useCallback(
    function animateFn(time: number) {
      if (previousTimeRef.current !== undefined) {
        if (!isMobile || enableOnMobile) {
          const scrollY = window.pageYOffset;
          if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const windowHeight = window.innerHeight;

            if (rect.bottom >= 0 && rect.top <= windowHeight) {
              const yPos = -(scrollY - elementTop) * speed;
              setOffset(yPos);
            }
          }
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animateFn);
    },
    [speed, isMobile, enableOnMobile],
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
    willChange: "transform",
  };

  return { elementRef, style };
};

interface HoverConfig {
  scale?: number;
  translateY?: number;
  duration?: number;
  easing?: string;
}

// Performance-optimized GPU Hover Animation
export const useHoverAnimation = <T extends HTMLElement>(
  config: HoverConfig = {},
) => {
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<T>(null);

  const scale = config.scale ?? 1.03;
  const translateY = config.translateY ?? -6;
  const duration = config.duration ?? 300;
  const easing = config.easing ?? "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.style.transform = "translateZ(0)";
    element.style.transition = `transform ${duration}ms ${easing}`;

    const handleMouseEnter = () => {
      setIsHovered(true);
      element.style.transform = `translate3d(0, ${translateY}px, 0) scale3d(${scale}, ${scale}, 1)`;
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      element.style.transform = "translate3d(0, 0, 0) scale3d(1, 1, 1)";
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [scale, translateY, duration, easing]);

  return { elementRef, isHovered };
};

// Reduced Motion Detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

// Performance Monitor Hook
export const useAnimationPerformance = () => {
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastTimeRef.current = performance.now();
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
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return { fps, isLowPerformance: fps < 30 };
};
