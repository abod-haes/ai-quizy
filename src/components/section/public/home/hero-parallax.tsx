"use client";
import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/section/public/home/hero/ParallaxHeader";
import { ParallaxProductCard as ProductCard } from "@/components/section/public/home/hero/ParallaxProductCard";

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
  const thirdRow = products.slice(10);

  const rowClass =
    "mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 md:px-6 lg:grid-cols-5";
  const thirdRowClass =
    "mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 md:px-6 lg:grid-cols-4 lg:max-w-[58rem]";

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-background pt-24 antialiased sm:pt-28 md:pt-32">
      <div className="flex items-center justify-center">
        <Header />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-3 pb-12 sm:space-y-4 md:space-y-5"
      >
        <div className={rowClass}>
          {firstRow.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        <div className={rowClass}>
          {secondRow.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 + index * 0.04 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        {thirdRow.length > 0 && (
          <div className={thirdRowClass}>
            {thirdRow.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.24 + index * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

// Header and ProductCard moved to hero/ParallaxHeader and hero/ParallaxProductCard
