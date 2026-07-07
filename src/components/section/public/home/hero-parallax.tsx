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

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const isMobile = useIsMobile();
  const maxShift = isMobile ? 200 : 1000;
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, maxShift]),
    springConfig,
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -maxShift]),
    springConfig,
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [isMobile ? 5 : 15, 0]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [isMobile ? 8 : 20, 0]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.2],
      [isMobile ? -200 : -700, isMobile ? 200 : 500],
    ),
    springConfig,
  );
  return (
    <div
      ref={ref}
      className="relative flex min-h-[160vh] flex-col overflow-hidden pt-40 antialiased [perspective:1000px] [transform-style:preserve-3d] md:min-h-[260vh]"
    >
      <div className="flex items-center justify-center md:flex-1 md:items-start md:justify-start">
        <Header />
      </div>
      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className="px-4 sm:px-6 md:px-0"
      >
        <motion.div className="custom-scrollbar mb-10 flex snap-x snap-mandatory scroll-px-4 flex-row-reverse gap-4 overflow-x-auto sm:mb-16 sm:gap-6 md:mb-20 md:snap-none md:gap-20 md:overflow-visible">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="custom-scrollbar mb-10 flex snap-x snap-mandatory scroll-px-4 flex-row gap-4 overflow-x-auto sm:mb-16 sm:gap-6 md:mb-20 md:snap-none md:gap-20 md:overflow-visible">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="custom-scrollbar flex snap-x snap-mandatory scroll-px-4 flex-row-reverse gap-4 overflow-x-auto sm:gap-6 md:snap-none md:gap-20 md:overflow-visible">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

// Header and ProductCard moved to hero/ParallaxHeader and hero/ParallaxProductCard
