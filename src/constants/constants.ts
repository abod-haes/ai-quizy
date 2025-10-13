export const authPaths = ["login", "register", "reset-password"];
export const privatePaths = [];

// sidebar-data.ts
import {
  BookOpen,
  Library,
  GraduationCap,
  Folder,
  FileQuestion,
  Users,
  ClipboardList,
} from "lucide-react";

export type SidebarItem = {
  title: string;
  icon?: React.ElementType;
  href?: string;
  children?: SidebarItem[];
};

// لمستخدمين;
// المعلمين;
// المكتبات;
// المواد;
// الدروس;
// الوحدات;
// الكويزات;

export const data = {
  user: {
    name: "Latifa",
    email: "latifa@student.edu",
    avatar: "https://i.pravatar.cc/100?u=latifa",
    role: "Student",
  },

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
      title: "Libraries",
      url: "#",
      icon: Library,
      isActive: true,
      items: [
        { title: "References", url: "#" },
        { title: "E-Books", url: "#" },
        { title: "Research Papers", url: "#" },
      ],
    },
    {
      title: "Subjects",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Mathematics", url: "#" },
        { title: "Physics", url: "#" },
        { title: "Chemistry", url: "#" },
        { title: "Computer Science", url: "#" },
      ],
    },
    {
      title: "Lessons",
      url: "#",
      icon: GraduationCap,
      items: [
        { title: "Complex Numbers", url: "#" },
        { title: "Newton’s Laws", url: "#" },
        { title: "Object-Oriented Programming", url: "#" },
      ],
    },
    {
      title: "Units",
      url: "#",
      icon: Folder,
      items: [
        { title: "Fundamentals", url: "#" },
        { title: "Advanced Concepts", url: "#" },
      ],
    },
    {
      title: "Quizzes",
      url: "#",
      icon: FileQuestion,
      items: [
        { title: "Algebra Basics", url: "#" },
        { title: "Motion & Forces", url: "#" },
        { title: "Data Structures", url: "#" },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: Users,
      items: [
        { title: "Students", url: "#" },
        { title: "Teachers", url: "#" },
        { title: "Administration", url: "#" },
      ],
    },
  ],

  // Study programs or training projects
  projects: [
    {
      name: "Artificial Intelligence Course",
      url: "#",
      icon: ClipboardList,
    },
    {
      name: "Engineering Program",
      url: "#",
      icon: GraduationCap,
    },
    {
      name: "Web Development Bootcamp",
      url: "#",
      icon: BookOpen,
    },
  ],
};
