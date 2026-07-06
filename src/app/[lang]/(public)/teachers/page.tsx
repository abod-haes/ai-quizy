import { Metadata } from "next";
import TeachersSection from "@/components/section/teachers/teachers-section";

export const metadata: Metadata = {
  title: "الأساتذة",
  description: "استعرض أساتذة Quizy وابدأ الاختبارات المرتبطة بكل أستاذ.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
};

export default function TeachersPage() {
  return <TeachersSection />;
}
