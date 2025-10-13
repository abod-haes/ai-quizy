"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Mic,
  ChevronDown,
  Sparkles,
  Bot,
  User,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AiChatSidebar } from "./ai-chat-sidebar";
import Image from "next/image";
import Link from "next/link";
import { routesName } from "@/utils/constant";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const suggestedPrompts = [
  "الرياضيات",
  "العلوم",
  "اللغة العربية",
  "التاريخ",
  "الجغرافيا",
  "الفنون",
  "التكنولوجيا",
  "الرياضة",
];

export function AiChatContainer() {
  const getLocalizedHref = useLocalizedHref();

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      title: "مساعدة في الرياضيات",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string | null>("1");
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const createNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: "محادثة جديدة",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(sessions[0]?.id || null);
    }
  };

  const sendMessage = (message: string) => {
    if (!message.trim() || !activeSessionId) return;

    const userMessage: Message = {
      id: `${Date.now()}-user-${Math.random().toString(36).substr(2, 9)}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setSessions(
      sessions.map((session) =>
        session.id === activeSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              updatedAt: new Date(),
            }
          : session,
      ),
    );

    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `${Date.now()}-ai-${Math.random().toString(36).substr(2, 9)}`,
        role: "assistant",
        content: "هذه رسالة تجريبية من المساعد الذكي. سأساعدك في حل أسئلتك!",
        timestamp: new Date(),
      };

      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                messages: [...session.messages, aiMessage],
                updatedAt: new Date(),
              }
            : session,
        ),
      );
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const sessionsList = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    messagesCount: s.messages.length,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));

  return (
    <div className="from-background via-background to-primary/5 flex h-screen overflow-hidden bg-gradient-to-br">
      {/* Main Chat Area */}
      <motion.div className="relative flex w-full flex-1 flex-col overflow-hidden transition-all duration-300">
        <div className="py flex items-center justify-end gap-2">
          <div className="flex justify-end">
            <Link
              href={getLocalizedHref(routesName.home)}
              aria-label="quizy home"
            >
              <div className="relative flex items-center gap-2">
                <p className="from-primary to-primary/70 relative z-10 mt-1 bg-gradient-to-br bg-clip-text text-3xl font-bold text-transparent">
                  Quizy
                </p>
                <Image
                  src="/images/logo-light.png"
                  alt="quizy Logo"
                  width={40}
                  height={40}
                  className="h-8 w-auto drop-shadow-lg"
                  priority
                />
              </div>
            </Link>
          </div>
          {/* Sidebar Toggle Button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-background/80 backdrop-blur-sm"
            >
              <ChevronRight
                className={cn(
                  "size-5 transition-transform",
                  !isSidebarOpen && "rotate-180",
                )}
              />
            </Button>
          </motion.div>
        </div>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {activeSession?.messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full items-center justify-center px-4"
            >
              <div className="w-full max-w-4xl text-center">
                {/* Greeting */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <h1 className="text-foreground mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
                    مرحباً! ما الذي تريد أن نتعمق فيه اليوم؟
                  </h1>
                </motion.div>

                {/* Main Input Area */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <div className="relative mx-auto max-w-3xl">
                    <div className="border-border/50 bg-background/50 focus-within:border-primary/50 focus-within:bg-background relative flex items-center rounded-2xl border backdrop-blur-sm transition-all">
                      {/* Attach Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="m-2 size-10 rounded-full"
                      >
                        <Plus className="size-5" />
                      </Button>

                      {/* Textarea */}
                      <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="اكتب رسالتك للمساعد الذكي..."
                        className="min-h-[60px] resize-none border-0 bg-transparent px-2 py-4 text-base focus-visible:ring-0"
                      />

                      {/* Quick Response Dropdown */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mx-2 rounded-full"
                      >
                        رد سريع
                        <ChevronDown className="ml-1 size-4" />
                      </Button>

                      {/* Send/Voice Button */}
                      <Button
                        onClick={() => sendMessage(inputMessage)}
                        disabled={!inputMessage.trim()}
                        size="icon"
                        className="m-2 size-10 rounded-full"
                      >
                        {inputMessage.trim() ? (
                          <Sparkles className="size-5" />
                        ) : (
                          <Mic className="size-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Suggested Prompts */}
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mx-auto max-w-4xl"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {suggestedPrompts.map((prompt, index) => (
                      <motion.div
                        key={prompt}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => handlePromptClick(prompt)}
                          className="border-border/30 bg-background/50 hover:border-primary/30 hover:bg-primary/5 h-auto w-full rounded-xl p-4 text-left backdrop-blur-sm transition-all"
                        >
                          <span className="text-sm font-medium">{prompt}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="mx-auto max-w-4xl px-4 py-8 pt-20">
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {activeSession?.messages.map((message, index) => (
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
                        "flex gap-4",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
                          <Bot className="text-primary size-5" />
                        </div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2",
                          message.role === "user"
                            ? "bg-primary text-white"
                            : "border-border/50 bg-background/50 border backdrop-blur-sm",
                        )}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </motion.div>

                      {message.role === "user" && (
                        <div className="from-primary to-primary/70 flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br">
                          <User className="size-5 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start gap-4"
                  >
                    <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
                      <Bot className="text-primary size-5" />
                    </div>
                    <div className="border-border/50 bg-background/50 rounded-2xl border px-6 py-4 backdrop-blur-sm">
                      <div className="flex gap-1">
                        <motion.div
                          className="bg-primary/60 size-2 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0,
                          }}
                        />
                        <motion.div
                          className="bg-primary/60 size-2 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                        />
                        <motion.div
                          className="bg-primary/60 size-2 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Input Area - Only show when there are messages */}
        {(activeSession?.messages.length ?? 0) > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="border-border/50 bg-background/95 supports-[backdrop-filter]:bg-background/80 border-t p-6 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-4xl">
              <div className="border-border/50 bg-background/50 focus-within:border-primary/50 focus-within:bg-background relative flex items-center rounded-2xl border backdrop-blur-sm transition-all">
                <Button
                  variant="ghost"
                  size="icon"
                  className="m-2 size-10 rounded-full"
                >
                  <Plus className="size-5" />
                </Button>

                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="اكتب رسالتك هنا..."
                  className="min-h-[60px] resize-none border-0 bg-transparent px-2 py-4 text-base focus-visible:ring-0"
                />

                <Button
                  onClick={() => sendMessage(inputMessage)}
                  disabled={!inputMessage.trim()}
                  size="icon"
                  className="m-2 size-10 rounded-full"
                >
                  <Sparkles className="size-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      {/* Sidebar */}
      <AiChatSidebar
        sessions={sessionsList}
        activeSessionId={activeSessionId}
        isOpen={isSidebarOpen}
        onCreateSession={createNewSession}
        onSelectSession={setActiveSessionId}
        onDeleteSession={deleteSession}
      />
    </div>
  );
}
