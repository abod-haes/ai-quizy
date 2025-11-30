import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

import { ThemeProvider } from "@/providers/ThemeProvider";
import ReactQueryProvider from "@/providers/QueryProvider";
import { TranslationsProvider } from "@/providers/TranslationsProvider";

import { arFont, enFont } from "@/lib/fonts";
import { getDirection } from "@/utils/translations/language-utils";
import {
  getDictionary,
  i18n,
  Lang,
} from "@/utils/translations/dictionary-utils";
import { AuthProvider } from "@/providers/authProvider";

interface RootLayoutProps {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { siteMeta: dict } = await getDictionary(lang as Lang);

  return {
    title: {
      template: `%s - ${dict.siteName}`,
      absolute: dict.siteName,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.ico", type: "image/x-icon" },
      ],
      apple: [{ url: "/favicon.ico", sizes: "180x180", type: "image/x-icon" }],
    },
  };
}

export async function generateStaticParams() {
  return i18n.langs.map((lang) => ({ lang }));
}

export default async function RootLayout({
  params,
  children,
}: RootLayoutProps) {
  const { lang } = await params;
  const translations = await getDictionary(lang);
  const fontClass = lang == "ar" ? arFont.className : enFont.className;

  return (
    <html lang={lang} dir={getDirection(lang)} suppressHydrationWarning>
      <body className={`${fontClass} antialiased`} suppressHydrationWarning>
        <ReactQueryProvider>
          <TranslationsProvider translations={translations}>
            <ThemeProvider>
              <NextTopLoader color="var(--color-primary)" showSpinner={false} />
              <Toaster
                position={lang == "ar" ? "bottom-left" : "bottom-right"}
                toastOptions={{
                  style: {
                    fontSize: "0.875rem",
                    textAlign: "start",
                  },
                  className: `antialiased ${fontClass}`,
                }}
              />
              <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
          </TranslationsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
