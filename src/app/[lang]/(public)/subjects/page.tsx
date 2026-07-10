import { Metadata } from "next";
import SubjectsSection from "@/components/section/subjects/subjects-section";

export const metadata: Metadata = {
  title: "المواد",
  description: "استعرض مواد Quizy وابدأ الاختبارات المرتبطة بكل مادة.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
};

export default function SubjectsPage() {
  return <SubjectsSection />;
}
