import React from "react";
import { AiChatContainer } from "@/components/section/public/ai-assistant/ai-chat-container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المساعد الذكي | Quizy",
  description: "استخدم المساعد الذكي للحصول على إجابات فورية لأسئلتك",
  keywords: ["مساعد ذكي", "AI", "chatbot", "أسئلة وأجوبة"],
};

export default function AiAssistantPage() {
  return <AiChatContainer />;
}
