"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface AiChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function AiChatInput({ onSendMessage, disabled }: AiChatInputProps) {
  const [inputMessage, setInputMessage] = useState("");

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage("");
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="border-border/50 bg-background/95 supports-[backdrop-filter]:bg-background/80 relative border-t p-6 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-4xl">
        <div className="relative">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="اكتب رسالتك هنا... (Enter للإرسال)"
            disabled={disabled}
            className="border-border/50 bg-background/50 focus:border-primary/50 focus:bg-background min-h-[120px] resize-none rounded-2xl pr-14 text-base backdrop-blur-sm transition-all"
          />

          <motion.div
            className="absolute bottom-4 left-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={handleSend}
              disabled={!inputMessage.trim() || disabled}
              size="icon"
              className="size-12 rounded-full shadow-lg"
            >
              <Send className="size-5" />
            </Button>
          </motion.div>
        </div>

        <p className="text-muted-foreground mt-3 text-center text-xs">
          المساعد الذكي قد يرتكب أخطاء. تحقق من المعلومات المهمة.
        </p>
      </div>
    </motion.div>
  );
}
