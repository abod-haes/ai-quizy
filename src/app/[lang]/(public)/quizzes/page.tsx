import React from "react";
import { Metadata } from "next";
import { QuizzesSection } from "@/components/section/quizzes";
import { Lang, getDictionary } from "@/utils/translations/dictionary-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { quizzes: quizzesDict } = await getDictionary(lang as Lang);
  return {
    title: quizzesDict.title,
    description: quizzesDict.description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.ico", type: "image/x-icon" },
      ],
    },
  };
}

export default function QuizzesPage() {
  return <QuizzesSection />;
}
