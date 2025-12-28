"use client";
import { useAnimation, useInView, type Variants, type Transition } from "framer-motion";
import { useEffect, useMemo, type RefObject } from "react";

export function createFadeInUp(duration = 0.6, y = 20): Variants {
  return {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration } },
  };
}

export function createSlideIn(
  isRtl: boolean,
  distance = 48,
  duration = 0.7,
): Variants {
  return {
    hidden: { opacity: 0, x: isRtl ? distance : -distance },
    show: { opacity: 1, x: 0, transition: { duration } },
  };
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export function useRevealedControls(
  ref: RefObject<Element | null>,
  options?: { amount?: number },
): ReturnType<typeof useAnimation> {
  const controls = useAnimation();
  const inView = useInView(ref, {
    amount: options?.amount ?? 0.25,
  });

  useEffect(() => {
    if (inView) {
      void controls.start("show");
    } else {
      void controls.start("hidden");
    }
  }, [inView, controls]);

  return controls;
}

/**
 * Hook for carousel/slider transitions
 * Provides consistent spring animation configuration
 */
export function useCarouselTransition(options?: {
  stiffness?: number;
  damping?: number;
  mass?: number;
}): Transition {
  return useMemo(
    () => ({
      type: "spring",
      stiffness: options?.stiffness ?? 70,
      damping: options?.damping ?? 20,
      mass: options?.mass ?? 1,
    }),
    [options?.stiffness, options?.damping, options?.mass],
  );
}

/**
 * Hook for smooth fade transitions
 */
export function useFadeTransition(duration = 0.4): Transition {
  return useMemo(
    () => ({
      duration,
      ease: "easeInOut",
    }),
    [duration],
  );
}
