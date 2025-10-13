import type { Metadata } from "next";
import type { EnhancedSeoInput } from "./enhanced-meta";

/**
 * Helper to build OpenGraph metadata.
 */
export function buildOpenGraph({
  lang,
  title,
  description,
  type = "website",
  image,
  pathname,
  siteName,
  siteURL,
  publishedTime,
  modifiedTime,
  authors,
  openGraphOverrides = {},
}: EnhancedSeoInput & {
  siteName: string;
  siteURL: string;
  openGraphOverrides?: Partial<Metadata["openGraph"]>;
}): Metadata["openGraph"] {
  const img = image || `${siteURL}/images/og-image.jpg`;
  const og: Metadata["openGraph"] = {
    title: typeof title === "string" ? title : title.absolute,
    description,
    images: [
      {
        url: img,
        width: 1200,
        height: 630,
        alt: typeof title === "string" ? title : title.absolute,
      },
    ],
    siteName,
    url: `${siteURL}/${lang}${pathname}`,
    locale: lang,
    type,
    ...(type === "article" &&
      authors && {
        publishedTime,
        modifiedTime,
        authors: authors.map((author) => author.name),
      }),
    ...openGraphOverrides,
  };
  return og;
}
