"use client";

import { useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function useHeaderAnimations() {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Enhanced spring physics for smoother animations
  const widthLinear = useTransform(scrollYProgress, [0, 0.05], [1, 0.96]);
  const widthSpring = useSpring(widthLinear, {
    stiffness: 200,
    damping: 30,
    mass: 0.5,
  });
  const widthPercent = useTransform(
    widthSpring,
    (v) => `${(v * 100).toFixed(2)}%`,
  );

  const smooth = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    mass: 0.3,
  });

  const logoScale = useTransform(smooth, [0, 0.05], [1, 0.92]);
  const headerY = useTransform(smooth, [0, 0.05], [0, -4]);
  const leftX = useTransform(smooth, [0, 0.05], [0, -8]);
  const centerY = useTransform(smooth, [0, 0.05], [0, -2]);
  const rightX = useTransform(smooth, [0, 0.05], [0, 8]);
  const borderOpacity = useTransform(smooth, [0, 0.05], [0.3, 0.6]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setIsScrolled(v > 0.02);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return {
    isScrolled,
    widthPercent,
    headerY,
    leftX,
    centerY,
    rightX,
    logoScale,
    borderOpacity,
    scrollYProgress,
  };
}
