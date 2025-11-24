"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  createFadeInUp,
  staggerContainer,
  useRevealedControls,
} from "@/lib/motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useCurrentLang } from "@/hooks/useCurrentLang";

const gradients = [
  "from-primary/20 to-secondary/20",
  "from-secondary/20 to-primary/20",
  "from-primary/20 via-secondary/20 to-primary/20",
  "from-secondary/20 to-primary/20",
  "from-primary/20 via-secondary/30 to-primary/20",
];

function DownloadShowcaseSection() {
  const t = useTranslation();
  const lang = useCurrentLang();
  const isRTL = lang === "ar";
  const showcase = t.download?.showcase;
  const sectionRef = useRef<HTMLElement | null>(null);
  const controls = useRevealedControls(sectionRef, { amount: 0.25 });
  const fadeInUp = createFadeInUp(0.6, 20);
  const [currentIndex, setCurrentIndex] = useState(0);

  const screenshots =
    showcase?.screenshots?.map(
      (screenshot: { title: string; description: string }, index: number) => ({
        ...screenshot,
        id: index + 1,
        gradient: gradients[index] || gradients[0],
      }),
    ) || [];

  useEffect(() => {
    if (screenshots.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [screenshots.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + screenshots.length) % screenshots.length,
    );
  };

  if (!showcase || screenshots.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--section-padding-y)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_400px_at_50%_100%,hsl(var(--primary)/0.08),transparent_60%)]" />

      <div className="relative container">
        <motion.div
          initial="hidden"
          animate={controls}
          className="mx-auto max-w-6xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <h2 className="from-foreground to-foreground/70 mb-4 bg-gradient-to-b bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {showcase.title}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
              {showcase.subtitle}
            </p>
          </motion.div>

          {/* Screenshot carousel */}
          <motion.div variants={staggerContainer} className="relative">
            <div className="relative w-full overflow-hidden rounded-3xl">
              <motion.div
                className="flex items-center"
                style={{
                  flexDirection: "row",
                  width: `${screenshots.length * 100}%`,
                }}
                animate={{
                  x: isRTL
                    ? `${(currentIndex * 100) / screenshots.length}%`
                    : `-${(currentIndex * 100) / screenshots.length}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                }}
              >
                {screenshots.map((screenshot, index) => (
                  <motion.div
                    key={screenshot.id}
                    className="relative flex flex-shrink-0 items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: index === currentIndex ? 1 : 0.5,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    style={{
                      width: `calc(100% / ${screenshots.length})`,
                    }}
                  >
                    <div className="border-border/60 bg-card/50 relative aspect-[9/19] w-[280px] overflow-hidden rounded-[2.5rem] border-8 shadow-2xl backdrop-blur-sm sm:w-[320px]">
                      <div
                        className={`bg-gradient-to-br ${screenshot.gradient} relative h-full w-full p-8`}
                      >
                        <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
                          <motion.div
                            className="bg-primary/20 size-24 rounded-2xl"
                            animate={{
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: index === currentIndex ? 1 : 0.8,
                              y: 0,
                            }}
                            transition={{
                              delay: 0.1,
                              duration: 0.3,
                            }}
                          >
                            <h3 className="mb-2 text-xl font-bold">
                              {screenshot.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {screenshot.description}
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Navigation buttons */}
            <motion.button
              onClick={isRTL ? nextSlide : prevSlide}
              className={`border-border/60 bg-card/50 hover:bg-card/80 text-primary absolute top-1/2 -translate-y-1/2 rounded-full border p-2 backdrop-blur-sm ${
                isRTL ? "right-4" : "left-4"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              aria-label="Previous screenshot"
            >
              {isRTL ? (
                <ChevronRight className="size-6" />
              ) : (
                <ChevronLeft className="size-6" />
              )}
            </motion.button>
            <motion.button
              onClick={isRTL ? prevSlide : nextSlide}
              className={`border-border/60 bg-card/50 hover:bg-card/80 text-primary absolute top-1/2 -translate-y-1/2 rounded-full border p-2 backdrop-blur-sm ${
                isRTL ? "left-4" : "right-4"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              aria-label="Next screenshot"
            >
              {isRTL ? (
                <ChevronLeft className="size-6" />
              ) : (
                <ChevronRight className="size-6" />
              )}
            </motion.button>

            {/* Dots indicator */}
            <div className="mt-8 flex justify-center gap-2">
              {screenshots.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-primary/30 hover:bg-primary/50 w-2"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  aria-label={`Go to screenshot ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default DownloadShowcaseSection;
