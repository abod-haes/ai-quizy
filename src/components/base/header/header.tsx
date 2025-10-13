"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { NavLinkHeader, routesName } from "@/utils/constant";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MenuIcon, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";

function Header() {
  const getLocalizedHref = useLocalizedHref();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();

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
  const route = useRouter();
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setIsScrolled(v > 0.02);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Enhanced nav item variants
  const navItemVariants = {
    hidden: { y: 8, opacity: 0, scale: 0.95 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
      },
    },
  };

  return (
    <header
      className={cn(
        "relative z-50 transition-all duration-500 will-change-transform",
        isScrolled ? "sticky top-2" : "",
      )}
    >
      {/* Animated progress bar */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-[60] h-[2px] w-full origin-left"
        style={{
          scaleX: scrollYProgress,
        }}
      >
        <div className="from-primary via-primary/80 to-primary/60 h-full w-full bg-gradient-to-r" />
      </motion.div>

      {/* Decorative gradient background */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          opacity: useTransform(smooth, [0, 0.05], [0, 1]),
        }}
      >
        <div className="from-primary/5 absolute inset-0 bg-gradient-to-b via-transparent to-transparent" />
      </motion.div>

      <div className="relative container">
        <div className="rounded-full py-2">
          <motion.div
            className={cn(
              "group relative z-10 mx-auto flex items-center justify-between transition-all duration-500",
              isScrolled
                ? "border-border/60 bg-background/95 shadow-primary/5 supports-[backdrop-filter]:bg-background/80 rounded-full border px-4 py-3 shadow-lg backdrop-blur-xl"
                : "py-1",
            )}
            style={{
              width: widthPercent,
              minWidth: "min(100%, 320px)",
              y: headerY,
              boxShadow: isScrolled
                ? "0 10px 40px -10px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)"
                : "none",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Gradient border effect on scroll */}
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
              style={{
                opacity: borderOpacity,
                background:
                  "linear-gradient(135deg, rgba(var(--primary-rgb, 59, 130, 246), 0.1), transparent 50%, rgba(var(--primary-rgb, 59, 130, 246), 0.05))",
              }}
            />

            {/* Left section - Login button / Mobile menu */}
            <motion.div
              className="flex items-center gap-2 will-change-transform"
              style={{ x: leftX }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Mobile menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Open menu"
                      className="hover:bg-primary/10"
                    >
                      <MenuIcon className="size-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    title="Navigation Menu"
                    hideTitle
                    className="w-[280px] sm:w-[320px]"
                  >
                    {/* Logo Section */}
                    <div className="border-border/50 mb-8 flex items-center gap-2 border-b py-4">
                      <Image
                        src="/images/logo-light.png"
                        alt="Quizy Logo"
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                      />
                      <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
                        Quizy
                      </span>
                    </div>

                    {/* Navigation Links */}
                    <motion.nav
                      className="flex flex-col gap-1"
                      initial="hidden"
                      animate="show"
                      variants={{
                        show: {
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {NavLinkHeader.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <motion.div
                            variants={{
                              hidden: { x: -15, opacity: 0 },
                              show: {
                                x: 0,
                                opacity: 1,
                                transition: {
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 24,
                                },
                              },
                            }}
                          >
                            <Link
                              href={getLocalizedHref(link.href)}
                              className="group/mobile text-foreground hover:bg-primary/5 hover:text-primary relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all"
                            >
                              <div className="bg-primary absolute inset-y-0 left-0 w-1 rounded-r-full opacity-0 transition-opacity group-hover/mobile:opacity-100" />
                              <span className="relative">{link.label}</span>
                            </Link>
                          </motion.div>
                        </SheetClose>
                      ))}
                    </motion.nav>

                    {/* Login Button */}
                    <motion.div
                      className="absolute right-6 bottom-6 left-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <SheetClose asChild>
                        <Button
                          variant="default"
                          size="lg"
                          onClick={() =>
                            route.push(getLocalizedHref(routesName.signin))
                          }
                          className="w-full font-semibold"
                        >
                          تسجيل دخول
                        </Button>
                      </SheetClose>
                    </motion.div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop login button */}
              <div className="hidden md:block">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      route.push(getLocalizedHref(routesName.signin))
                    }
                    className="relative overflow-hidden"
                  >
                    <motion.div
                      className="from-primary/0 to-primary/0 absolute inset-0 bg-gradient-to-r via-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{
                        x: "100%",
                        transition: { duration: 0.6 },
                      }}
                    />
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Sparkles className="size-3.5" />
                      تسجيل دخول
                    </span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Center navigation - Desktop */}
            <motion.div
              className="hidden justify-center will-change-transform md:flex"
              style={{ y: centerY }}
            >
              <motion.nav
                className="flex items-center gap-1"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.15,
                    },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                {NavLinkHeader.map((link) => (
                  <Link
                    className="nav-link relative px-3 py-2"
                    key={link.href}
                    href={getLocalizedHref(link.href)}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {/* Hover background effect */}
                    {hoveredLink === link.href && (
                      <motion.div
                        className="bg-primary/10 absolute inset-0 rounded-full"
                        layoutId="nav-hover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    <motion.span
                      className="text-primary relative text-sm font-semibold transition-colors sm:text-sm"
                      variants={navItemVariants}
                      whileHover={{ y: -2 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      {link.label}
                      {/* Underline animation */}
                      <motion.span
                        className="from-primary to-primary/50 absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-gradient-to-r"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.span>
                  </Link>
                ))}
              </motion.nav>
            </motion.div>

            {/* Right section - Logo */}
            <motion.div
              className="flex justify-end will-change-transform"
              style={{ x: rightX }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href={getLocalizedHref(routesName.home)}
                aria-label="quizy home"
              >
                <motion.div
                  className="relative flex items-center gap-2"
                  style={{ scale: logoScale }}
                  whileHover={{ scale: 1.08, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {/* Glow effect on hover - using Framer Motion whileHover */}
                  <motion.div
                    className="bg-primary/20 pointer-events-none absolute -inset-2 rounded-full blur-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <motion.p
                    className="from-primary to-primary/70 relative z-10 mt-1 bg-gradient-to-br bg-clip-text text-3xl font-bold text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    Quizy
                  </motion.p>

                  <motion.div
                    className="relative"
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src="/images/logo-light.png"
                      alt="quizy Logo"
                      width={40}
                      height={40}
                      className="h-8 w-auto drop-shadow-lg"
                      priority
                    />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export default Header;
