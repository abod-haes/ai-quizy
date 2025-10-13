import Link from "next/link";
import { Button } from "@/components/ui/button";

import { getCurrentLang } from "@/utils/translations/language-utils";
import { getDictionary, Lang } from "@/utils/translations/dictionary-utils";

export default async function NotFoundPage() {
  const lang = (await getCurrentLang()) as Lang;
  const { error: dict } = await getDictionary(lang);

  return (
    <html>
      <body>
        <div className="bg-background relative bottom-5 flex min-h-screen items-center justify-center px-4 py-15 md:px-6">
          <div className="max-w-md space-y-8 text-center">
            <h1 className="text-foreground text-8xl font-bold tracking-tight select-none md:text-9xl">
              404
            </h1>

            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-muted-foreground text-2xl font-semibold">
                  {dict.errorPage}
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {dict.description}{" "}
                </p>
              </div>
              <Button
                asChild
                className="!h-fit rounded-full !px-6 !py-2 text-base font-semibold"
              >
                <Link href={`/${lang}`}>{dict.goHome}</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
