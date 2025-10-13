export const routesName = {
  home: "/",
  aiAssistant: "/ai-assistant",
  signup: "/sign-up",
  signin: "/sign-in",
  about: "/about",
  profile: "/profile",
  download: "/download",
} as const;

export const NavLinkHeader: { label: string; href: TRouteName }[] = [
  {
    label: "رئيسية",
    href: routesName.home,
  },
  {
    label: "مساعد ذكي",
    href: routesName.aiAssistant,
  },
  {
    label: "تحميل التطبيق",
    href: routesName.download,
  },
  {
    label: "من نحن",
    href: routesName.about,
  },
];
export type TRouteName = (typeof routesName)[keyof typeof routesName];
