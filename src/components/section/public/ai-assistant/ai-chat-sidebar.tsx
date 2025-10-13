"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  title: string;
  messagesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AiChatSidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  isOpen: boolean;
  onCreateSession: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function AiChatSidebar({
  sessions,
  activeSessionId,
  isOpen,
  onCreateSession,
  onSelectSession,
  onDeleteSession,
}: AiChatSidebarProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: 320,
            opacity: 1,
            transition: {
              width: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
              opacity: {
                duration: 0.2,
                delay: 0.1,
              },
            },
          }}
          exit={{
            width: 0,
            opacity: 0,
            transition: {
              width: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
              opacity: {
                duration: 0.15,
              },
            },
          }}
          className="border-border/50 bg-background/95 supports-[backdrop-filter]:bg-background/80 relative flex flex-col overflow-hidden border-l backdrop-blur-xl"
        >
          {/* Gradient overlay */}
          <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent to-transparent" />

          {/* Header */}
          <div className="border-border/50 relative z-10 border-b p-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={onCreateSession}
                className="group/newbtn relative w-full overflow-hidden"
                size="lg"
              >
                <motion.div
                  className="from-primary/20 absolute inset-0 bg-gradient-to-r to-transparent opacity-0 transition-opacity group-hover/newbtn:opacity-100"
                  layoutId="new-session-hover"
                />
                <Plus className="ml-2 size-5" />
                <span className="relative z-10">محادثة جديدة</span>
              </Button>
            </motion.div>
          </div>

          {/* Sessions List */}
          <motion.div
            className="relative flex-1 overflow-y-auto p-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="space-y-2">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  variants={itemVariants}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    onClick={() => onSelectSession(session.id)}
                    className={cn(
                      "group/session relative w-full cursor-pointer rounded-xl border p-4 text-right transition-all",
                      activeSessionId === session.id
                        ? "border-primary/50 bg-primary/10 shadow-primary/5 shadow-lg"
                        : "border-border/30 bg-background/50 hover:border-primary/30 hover:bg-primary/5",
                    )}
                  >
                    {/* Active indicator */}
                    {activeSessionId === session.id && (
                      <motion.div
                        layoutId="active-session"
                        className="border-primary/50 absolute inset-0 rounded-xl border-2"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="text-primary size-4" />
                          <h3 className="text-foreground font-semibold">
                            {session.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {session.messagesCount} رسالة
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 opacity-0 transition-opacity group-hover/session:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                      >
                        <Trash2 className="text-destructive size-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
