import { useCallback, useEffect, useRef, useState } from "react";

// Hardware-accelerated GPU layer promotion hook
export const useHardwareAcceleration = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = "translateZ(0)";
      ref.current.style.backfaceVisibility = "hidden";
      ref.current.style.perspective = "1000px";
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


