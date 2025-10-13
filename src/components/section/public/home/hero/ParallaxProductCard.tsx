"use client";
import React from "react";
import { motion, type MotionValue } from "framer-motion";
import Image from "next/image";

export function ParallaxProductCard({
  product,
  translate,
}: {
  product: { title: string; link: string; thumbnail: string };
  translate: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ x: translate }}
      key={product.title}
      className="relative h-56 w-56 min-w-56 flex-shrink-0 snap-start sm:h-72 sm:w-72 sm:min-w-72 md:h-96 md:w-[30rem] md:min-w-[30rem]"
    >
      <div className="block">
        <Image
          src={product.thumbnail}
          height={600}
          width={600}
          className="shadow-secondary ring-border/50 absolute inset-0 h-full w-full rounded-xl object-cover object-center ring-1"
          alt={product.title}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 h-full w-full rounded-xl bg-black/0" />
      <h2 className="absolute bottom-3 left-3 hidden text-white md:block">
        {product.title}
      </h2>
    </motion.div>
  );
}
