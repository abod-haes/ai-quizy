import { Metadata } from "next";
import CoursesSection from "@/components/section/courses/courses-section";

export const metadata: Metadata = {
  title: "الكورسات",
  description: "استعرض كورسات ومواد Quizy وابدأ الاختبارات المرتبطة بها.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
};

export default function CoursesPage() {
  return <CoursesSection />;
}
