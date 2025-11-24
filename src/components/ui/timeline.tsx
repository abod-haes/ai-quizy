/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { CheckCircle, Clock, Circle } from "lucide-react";

export interface TimelineItem {
  title: string;
  description: string;
  date?: string;
  image?: string;
  status?: "completed" | "current" | "upcoming";
  category?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const getStatusConfig = (status: TimelineItem["status"]) => {
  const configs = {
    completed: {
      progressColor: "bg-green-500",
      borderColor: "border-green-500/20",
      badgeBg: "bg-green-100 dark:bg-green-900/30",
      badgeText: "text-green-800 dark:text-green-200",
    },
    current: {
      progressColor: "bg-blue-600 dark:bg-blue-400",
      borderColor: "border-blue-600/20 dark:border-blue-400/20",
      badgeBg: "bg-blue-100 dark:bg-blue-900/30",
      badgeText: "text-blue-800 dark:text-blue-200",
    },
    upcoming: {
      progressColor: "bg-yellow-500",
      borderColor: "border-yellow-500/20",
      badgeBg: "bg-yellow-100 dark:bg-yellow-900/30",
      badgeText: "text-yellow-800 dark:text-yellow-200",
    },
  };

  return configs[status || "upcoming"];
};

const getStatusIcon = (status: TimelineItem["status"]) => {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "current":
      return Clock;
    default:
      return Circle;
  }
};

export function Timeline({ items, className }: TimelineProps) {
  if (!items || items.length === 0) {
    return (
      <div
        className={cn("mx-auto w-full max-w-4xl px-4 py-8 sm:px-6", className)}
      >
        <p className="text-muted-foreground text-center">
          No timeline items to display
        </p>
      </div>
    );
  }

  return (
    <section
      className={cn("mx-[5rem]", className)}
      role="list"
      aria-label="Timeline of events and milestones"
    >
      <div className="relative">
        <div
          className="bg-border absolute top-0 bottom-0 left-4 w-px sm:left-6"
          aria-hidden="true"
        />

        <motion.div
          className="bg-primary absolute top-0 left-4 w-px origin-top sm:left-6"
          initial={{ scaleY: 0 }}
          whileInView={{
            scaleY: 1,
            transition: {
              duration: 1.2,
              ease: "easeOut",
              delay: 0.2,
            },
          }}
          viewport={{ once: true }}
          aria-hidden="true"
        />

        <div className="relative space-y-8 sm:space-y-12">
          {items.map((item, index) => {
            const config = getStatusConfig(item.status);
            const IconComponent = getStatusIcon(item.status);

            return (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }}
                viewport={{ once: true, margin: "-30px" }}
                role="listitem"
                aria-label={`Timeline item ${index + 1}: ${item.title}`}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="relative flex-shrink-0">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      tabIndex={0}
                      role="img"
                      aria-label={`Avatar for ${item.title}`}
                    >
                      <div className="border-background relative z-10 h-12 w-12 overflow-hidden rounded-full border-2 shadow-lg sm:h-16 sm:w-16">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={`${item.title} avatar`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="bg-muted flex h-full w-full items-center justify-center">
                            <IconComponent
                              className="text-muted-foreground/70 h-5 w-5 sm:h-6 sm:w-6"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="min-w-0 flex-1"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={cn(
                        "relative border transition-all duration-300 hover:shadow-md",
                        "bg-card/50 backdrop-blur-sm",
                        config.borderColor,
                        "group-hover:border-primary/30",
                      )}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <div className="min-w-0 flex-1">
                            <motion.h3
                              className="text-foreground group-hover:text-primary mb-1 text-lg font-semibold transition-colors duration-300 sm:text-xl"
                              layoutId={`title-${index}`}
                            >
                              {item.title}
                            </motion.h3>

                            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                              {item.category && (
                                <span className="font-medium">
                                  {item.category}
                                </span>
                              )}
                              {item.category && item.date && (
                                <span
                                  className="bg-muted-foreground h-1 w-1 rounded-full"
                                  aria-hidden="true"
                                />
                              )}
                              {item.date && (
                                <time dateTime={item.date}>{item.date}</time>
                              )}
                            </div>
                          </div>

                          <Badge
                            className={cn(
                              "w-fit border text-xs font-medium",
                              config.badgeBg,
                              config.badgeText,
                              "border-current/20",
                            )}
                            aria-label={`Status: ${item.status || "upcoming"}`}
                          >
                            {item.status
                              ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)
                              : "Upcoming"}
                          </Badge>
                        </div>

                        <motion.p
                          className="text-muted-foreground mb-4 text-sm leading-relaxed sm:text-base"
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {item.description}
                        </motion.p>

                        <div
                          className="bg-muted h-1 overflow-hidden rounded-full"
                          role="progressbar"
                          aria-valuenow={
                            item.status === "completed"
                              ? 100
                              : item.status === "current"
                                ? 65
                                : 25
                          }
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Progress for ${item.title}`}
                        >
                          <motion.div
                            className={cn(
                              "h-full rounded-full",
                              config.progressColor,
                            )}
                            initial={{ width: 0 }}
                            animate={{
                              width:
                                item.status === "completed"
                                  ? "100%"
                                  : item.status === "current"
                                    ? "65%"
                                    : "25%",
                            }}
                            transition={{
                              duration: 1.2,
                              delay: index * 0.2 + 0.8,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="absolute -bottom-6 left-4 -translate-x-1/2 transform sm:left-6"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.4,
              delay: items.length * 0.1 + 0.3,
              type: "spring",
              stiffness: 400,
            },
          }}
          viewport={{ once: true }}
          aria-hidden="true"
        >
          <div className="bg-primary h-3 w-3 rounded-full shadow-sm" />
        </motion.div>
      </div>
    </section>
  );
}
