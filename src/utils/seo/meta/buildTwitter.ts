import type { Metadata } from "next";

/**
 * Helper to build Twitter metadata.
 */
export function buildTwitter({
   title,
   description,
   image,
   siteURL,
   twitterOverrides = {},
}: {
   title: string | { absolute: string };
   description: string;
   image?: string;
   siteURL: string;
   twitterOverrides?: Partial<Metadata["twitter"]>;
}): Metadata["twitter"] {
   const img = image || `${siteURL}/images/og-image.jpg`;
   return {
      title: typeof title === "string" ? title : title.absolute,
      description,
      images: [img],
      card: "summary_large_image",
      ...twitterOverrides,
   };
}
