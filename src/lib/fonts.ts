import { Roboto, Almarai } from "next/font/google";

export const enFont = Roboto({
   weight: ["100", "300", "400", "500", "600", "700", "900"],
   variable: "--font-en",
   style: ["normal", "italic"],
   subsets: ["latin"],
});

export const arFont = Almarai({
   weight: ["300", "400", "700", "800"],
   subsets: ["arabic"],
   variable: "--font-ar",
   display: "swap",
});
