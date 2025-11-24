/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { createFadeInUp, useRevealedControls } from "@/lib/motion";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  username: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "Quizzy has transformed how I study. The gamified approach makes learning fun and engaging!",
    name: "Sarah Ahmed",
    username: "@sarahahmed",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    quote:
      "The AI assistant is incredible. It explains complex concepts in simple terms that I can actually understand.",
    name: "Mohammed Al-Rashid",
    username: "@mohammed_r",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    quote:
      "As a teacher, I love how Quizzy helps my students track their progress and identify areas for improvement.",
    name: "Dr. Fatima Hassan",
    username: "@drfatima",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    quote:
      "The multi-language support is amazing. I can study in Arabic and English seamlessly.",
    name: "Ahmed Omar",
    username: "@ahmedomar",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 5,
    quote:
      "Quizzy's analytics helped me understand my learning patterns and optimize my study schedule.",
    name: "Nour El-Din",
    username: "@noureldin",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 6,
    quote:
      "The community features are fantastic. I can share quizzes with classmates and learn together.",
    name: "Layla Mahmoud",
    username: "@laylamahmoud",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
];

const getVisibleCount = (width: number): number => {
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
};

function AboutTestimonialSection() {
  const lang = useCurrentLang();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Controls to re-trigger animations whenever the section enters the viewport
  const sectionRef = useRef<HTMLElement | null>(null);
  const textControls = useRevealedControls(sectionRef, { amount: 0.25 });

  // Custom variants
  const fadeInUp = createFadeInUp(0.6, 20);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);

      const oldVisibleCount = getVisibleCount(windowWidth);
      const newVisibleCount = getVisibleCount(newWidth);

      if (oldVisibleCount !== newVisibleCount) {
        const maxIndexForNewWidth = testimonials.length - newVisibleCount;
        if (currentIndex > maxIndexForNewWidth) {
          setCurrentIndex(Math.max(0, maxIndexForNewWidth));
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth, currentIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        const visibleCount = getVisibleCount(windowWidth);
        const maxIndex = testimonials.length - visibleCount;

        if (currentIndex >= maxIndex) {
          setDirection(-1);
          setCurrentIndex((prev) => prev - 1);
        } else if (currentIndex <= 0) {
          setDirection(1);
          setCurrentIndex((prev) => prev + 1);
        } else {
          setCurrentIndex((prev) => prev + direction);
        }
      }, 4000);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex, windowWidth, direction]);

  const visibleCount = getVisibleCount(windowWidth);
  const maxIndex = testimonials.length - visibleCount;
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;

  const goNext = () => {
    if (canGoNext) {
      setDirection(1);
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
      pauseAutoPlay();
    }
  };

  const goPrev = () => {
    if (canGoPrev) {
      setDirection(-1);
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
      pauseAutoPlay();
    }
  };

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const handleDragEnd = (event: any, info: any) => {
    const { offset } = info;
    const swipeThreshold = 30;

    if (offset.x < -swipeThreshold && canGoNext) {
      goNext();
    } else if (offset.x > swipeThreshold && canGoPrev) {
      goPrev();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--section-padding-y)]"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_50%,hsl(var(--primary)/0.06),transparent_60%)]" />

      <div className="relative container">
        <motion.div
          initial="hidden"
          animate={textControls}
          variants={fadeInUp}
          className="mb-8 text-center sm:mb-12 md:mb-16"
        >
          <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wider uppercase sm:text-sm">
            {lang === "ar" ? "آراء المستخدمين" : "Testimonials"}
          </span>
          <h3 className="from-primary to-primary/70 mt-3 bg-gradient-to-r bg-clip-text px-4 text-2xl font-bold text-transparent sm:mt-4 sm:text-3xl md:text-4xl">
            {lang === "ar"
              ? "تجارب الطلاب التحويلية"
              : "Transformative Student Experiences"}
          </h3>
          <div className="from-primary to-primary/70 mx-auto mt-4 h-1 w-16 bg-gradient-to-r sm:mt-6 sm:w-24"></div>
        </motion.div>

        <div className="relative" ref={containerRef}>
          <div className="right-0 mb-4 flex justify-center space-x-2 sm:absolute sm:-top-16 sm:mb-0 sm:justify-end">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goPrev}
              disabled={!canGoPrev}
              className={`rounded-full p-2 ${
                canGoPrev
                  ? "bg-card hover:bg-card/80 text-primary shadow-md"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              } transition-all duration-300`}
              aria-label={
                lang === "ar" ? "الشهادة السابقة" : "Previous testimonial"
              }
            >
              <ChevronLeft size={20} className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goNext}
              disabled={!canGoNext}
              className={`rounded-full p-2 ${
                canGoNext
                  ? "bg-card hover:bg-card/80 text-primary shadow-md"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              } transition-all duration-300`}
              aria-label={
                lang === "ar" ? "الشهادة التالية" : "Next testimonial"
              }
            >
              <ChevronRight size={20} className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
          </div>

          <div className="relative overflow-hidden px-2 sm:px-0">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 20,
              }}
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className={`w-full flex-shrink-0 ${
                    visibleCount === 3
                      ? "md:w-1/3"
                      : visibleCount === 2
                        ? "md:w-1/2"
                        : "w-full"
                  } p-2`}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98, cursor: "grabbing" }}
                  style={{ cursor: "grab" }}
                >
                  <motion.div
                    className="bg-card border-border shadow-primary/5 relative h-full overflow-hidden rounded-xl border p-4 shadow-lg sm:rounded-2xl sm:p-6"
                    whileHover={{
                      boxShadow:
                        "0 10px 15px -3px rgba(105, 73, 255, 0.1), 0 4px 6px -2px rgba(105, 73, 255, 0.05)",
                    }}
                  >
                    <div className="absolute -top-4 -left-4 opacity-10">
                      <Quote
                        size={windowWidth < 640 ? 40 : 60}
                        className="text-primary"
                      />
                    </div>

                    <div className="relative z-10 flex h-full flex-col">
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed font-medium sm:mb-6 sm:text-base">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>

                      <div className="border-border mt-auto border-t pt-3 sm:pt-4">
                        <div className="flex items-center">
                          <div className="relative flex-shrink-0">
                            <Image
                              width={48}
                              height={48}
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="border-card h-8 w-8 rounded-full border-2 object-cover shadow-sm sm:h-10 sm:w-10"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/api/placeholder/48/48";
                              }}
                            />
                            <motion.div
                              className="bg-primary/20 absolute inset-0 rounded-full"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0, 0.3, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                              }}
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-foreground text-sm font-bold sm:text-base">
                              {testimonial.name}
                            </h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              {testimonial.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="mt-6 flex justify-center sm:mt-8">
            {Array.from(
              { length: testimonials.length - visibleCount + 1 },
              (_: any, index: any) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="relative mx-1 focus:outline-none"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={
                    lang === "ar"
                      ? `اذهب إلى الشهادة ${index + 1}`
                      : `Go to testimonial ${index + 1}`
                  }
                >
                  <motion.div
                    className={`h-2 w-2 rounded-full ${
                      index === currentIndex
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                    animate={{
                      scale: index === currentIndex ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: index === currentIndex ? Infinity : 0,
                      repeatDelay: 1,
                    }}
                  />
                  {index === currentIndex && (
                    <motion.div
                      className="bg-primary/30 absolute inset-0 rounded-full"
                      animate={{
                        scale: [1, 1.8],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.button>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutTestimonialSection;
