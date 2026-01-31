import { dashboardRoutesName } from "@/utils/constant";
import type { TRouteName } from "@/utils/constant";
import {
  BookOpen,
  GraduationCap,
  Folder,
  FileQuestion,
  Users,
  School,
  Newspaper,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const authPaths = ["login", "register", "reset-password"];
export const privatePaths = [];

export type NavMainItem = {
  title: string;
  url?: TRouteName;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: TRouteName;
  }[];
};

export type ProjectItem = {
  name: string;
  url: TRouteName | string;
  icon: LucideIcon;
};

export const data = {
  user: {
    name: "Latifa",
    email: "latifa@student.edu",
    avatar: "https://i.pravatar.cc/100?u=latifa",
    role: "Student",
  },

  projects: [] as ProjectItem[],

  teachers: [
    {
      name: "Dr. Ahmed Ali",
      email: "ahmed.ali@university.edu",
      avatar: "https://i.pravatar.cc/100?u=ahmed",
      subject: "Mathematics",
    },
    {
      name: "Prof. Sara Hassan",
      email: "sara.hassan@university.edu",
      avatar: "https://i.pravatar.cc/100?u=sara",
      subject: "Physics",
    },
  ],

  navMain: [
    {
      title: "Classes",
      url: dashboardRoutesName.classes.href,
      icon: School,
    },
    {
      title: "Subjects",
      url: dashboardRoutesName.subjects.href,
      icon: BookOpen,
    },
    {
      title: "Lessons",
      url: dashboardRoutesName.lessons.href,
      icon: GraduationCap,
    },
    {
      title: "Units",
      url: dashboardRoutesName.units.href,
      icon: Folder,
    },
    {
      title: "Questions",
      url: dashboardRoutesName.questions.href,
      icon: FileQuestion,
    },
    {
      title: "Quizzes",
      url: dashboardRoutesName.quizzes.href,
      icon: Newspaper,
    },
    {
      title: "Users",
      icon: Users,
      items: [
        { title: "Students", url: dashboardRoutesName.students.href },
        { title: "Teachers", url: dashboardRoutesName.teachers.href },
        {
          title: "Administration",
          url: dashboardRoutesName.administration.href,
        },
      ],
    },
  ],
};
