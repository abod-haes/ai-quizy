"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AiChatMessagesProps {
  messages: Message[];
}

export function AiChatMessages({ messages }: AiChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-full items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="from-primary/20 to-primary/5 mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-gradient-to-br"
          >
            <Bot className="text-primary size-12" />
          </motion.div>
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            مرحباً! كيف يمكنني مساعدتك؟
          </h2>
          <p className="text-muted-foreground">
            ابدأ محادثة جديدة واسأل أي سؤال
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: index * 0.05,
            }}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {message.role === "assistant" && (
              <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
                <Bot className="text-primary size-5" />
              </div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-primary text-white"
                  : "border-border/50 bg-background/50 border",
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </motion.div>

            {message.role === "user" && (
              <div className="from-primary to-primary/70 flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br">
                <User className="size-5 text-white" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
