"use client";
import React, { ReactNode } from "react";
import {
  useHardwareAcceleration,
  useReducedMotion,
  useScrollAnimation,
} from "@/hooks/use-hardware-animations";

export type AnimationType =
  | "slideInUp"
  | "slideInDown"
  | "slideInLeft"
  | "slideInRight"
  | "fadeInScale"
  | "fadeInRotate";

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
  animation = "slideInUp",
  delay = 0,
  className = "",
  threshold = 0.1,
  triggerOnce = true,
}) => {
  const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold,
    triggerOnce,
  });
  const hardwareRef = useHardwareAcceleration<HTMLDivElement>();
  const prefersReducedMotion = useReducedMotion();

  const combinedRef = (node: HTMLDivElement | null) => {
    if (node) {
      if (elementRef) elementRef.current = node;
      if (hardwareRef) hardwareRef.current = node;
    }
  };

  const animationClass = prefersReducedMotion ? "" : `animate-${animation}`;

  return (
    <div
      ref={combinedRef}
      className={`gpu-accelerated performance-layer ${
        isVisible ? animationClass : "opacity-0"
      } ${className}`.trim()}
      style={{
        animationDelay: `${delay}s`,
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
  className = "",
  itemDelay = 0.1,
  animation = "slideInUp",
}) => {
  const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={elementRef} className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <HardwareAnimated
            key={child.key ?? `stagger-${index}`}
            animation={animation}
            delay={isVisible && !prefersReducedMotion ? index * itemDelay : 0}
          >
            {child}
          </HardwareAnimated>
        );
      })}
    </div>
  );
};
