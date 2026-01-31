import { Noto_Kufi_Arabic } from "next/font/google";

export const appFont = Noto_Kufi_Arabic({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["arabic"],
  variable: "--font-app",
  display: "swap",
});
