"use client";
import React from "react";
import { motion, type MotionValue } from "framer-motion";
import Image from "next/image";

export function ParallaxProductCard({
  product,
  translate,
}: {
  product: { title: string; link: string; thumbnail: string };
  translate?: MotionValue<number>;
}) {
  return (
    <motion.div
      style={translate ? { x: translate } : undefined}
      key={product.title}
      className="group relative aspect-[4/3] w-full overflow-hidden rounded-[1.35rem] border border-border bg-card shadow-sm"
    >
      <Image
        src={product.thumbnail}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        alt={product.title}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/0" />
    </motion.div>
  );
}
