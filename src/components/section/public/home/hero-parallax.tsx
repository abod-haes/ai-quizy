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
  const maxShift = isMobile ? 10 : 70;
  const thirdRowShift = isMobile ? 0 : 35;
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
    useTransform(scrollYProgress, [0, 0.22], [isMobile ? 2 : 8, 0]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.18], [0.45, 1]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.22], [isMobile ? 2 : 5, 0]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.22],
      [isMobile ? -24 : -80, isMobile ? 10 : 40],
    ),
    springConfig,
  );

  const rowClass =
    "mx-auto flex w-full max-w-7xl flex-wrap justify-center gap-3 px-4 sm:gap-4 sm:px-6 md:gap-5 lg:gap-6";

  return (
    <div
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 antialiased [perspective:1000px] [transform-style:preserve-3d] sm:pt-28 md:min-h-[118svh] md:pt-32 lg:min-h-[125svh]"
    >
      <div className="flex items-center justify-center">
        <Header />
      </div>
      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className="space-y-3 pb-10 sm:space-y-4 md:space-y-5 lg:space-y-6"
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
