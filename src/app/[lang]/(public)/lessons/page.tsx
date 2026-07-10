import { Metadata } from "next";
import LessonsSection from "@/components/section/lessons/lessons-section";

export const metadata: Metadata = {
  title: "الدروس",
  description: "استعرض دروس Quizy المرتبطة بالمواد والوحدات.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
};

export default function LessonsPage() {
  return <LessonsSection />;
}
