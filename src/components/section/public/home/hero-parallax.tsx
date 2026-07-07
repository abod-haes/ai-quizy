"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Header } from "@/components/section/public/home/hero/ParallaxHeader";
import { ParallaxProductCard as ProductCard } from "@/components/section/public/home/hero/ParallaxProductCard";
import { useIsMobile } from "@/hooks/use-mobile";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 220, damping: 28, bounce: 0 };

  const isMobile = useIsMobile();
  const maxShift = isMobile ? 8 : 55;
  const thirdRowShift = isMobile ? 0 : 25;
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, maxShift]),
    springConfig,
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -maxShift]),
    springConfig,
  );
  const translateXSoft = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, thirdRowShift]),
    springConfig,
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.22], [isMobile ? 1.5 : 6, 0]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.18], [0.55, 1]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.22], [isMobile ? 1.5 : 4, 0]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.22],
      [isMobile ? -18 : -55, isMobile ? 8 : 28],
    ),
    springConfig,
  );

  const rowClass =
    "mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-2.5 px-4 sm:gap-3 sm:px-6 md:gap-4 lg:gap-5";

  return (
    <div
      ref={ref}
      className="relative flex min-h-[92svh] flex-col overflow-hidden pt-20 antialiased [perspective:1000px] [transform-style:preserve-3d] sm:pt-24 md:min-h-[105svh] md:pt-28 lg:min-h-[112svh]"
    >
      <div className="flex items-center justify-center">
        <Header />
      </div>
      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className="space-y-2.5 pb-8 sm:space-y-3 md:space-y-4"
      >
        <motion.div className={rowClass}>
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className={rowClass}>
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className={rowClass}>
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXSoft}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

// Header and ProductCard moved to hero/ParallaxHeader and hero/ParallaxProductCard
