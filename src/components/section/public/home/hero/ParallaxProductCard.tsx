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
      className="group relative aspect-[4/3] h-auto w-[calc(50%-0.5rem)] min-w-0 flex-shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[11.5rem] md:w-[12.5rem] lg:w-[13.5rem] xl:w-[14.5rem]"
    >
      <Image
        src={product.thumbnail}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 200px, 232px"
        className="shadow-secondary ring-border/50 absolute inset-0 h-full w-full object-cover object-center ring-1 transition-transform duration-500 group-hover:scale-105"
        alt={product.title}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />
      <h2 className="absolute bottom-2 left-2 hidden max-w-[80%] truncate text-xs font-bold text-white drop-shadow md:block">
        {product.title}
      </h2>
    </motion.div>
  );
}
