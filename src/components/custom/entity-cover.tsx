"use client";

import React from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const imageKeys = [
  "image",
  "imageUrl",
  "thumbnail",
  "thumbnailUrl",
  "cover",
  "coverImage",
  "coverImageUrl",
  "photo",
  "photoUrl",
  "picture",
  "pictureUrl",
  "avatar",
  "avatarUrl",
  "icon",
  "url",
];

function getNestedUrl(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    const nestedKeys = ["url", "src", "path", "imageUrl"];

    for (const key of nestedKeys) {
      const nestedValue = objectValue[key];
      if (typeof nestedValue === "string" && nestedValue.trim()) {
        return nestedValue.trim();
      }
    }
  }

  return undefined;
}

export function getEntityImage(entity?: object | null) {
  if (!entity) return undefined;

  const entityRecord = entity as Record<string, unknown>;

  for (const key of imageKeys) {
    const image = getNestedUrl(entityRecord[key]);
    if (image) return image;
  }

  return undefined;
}

export function EntityCover({
  entity,
  title,
  label,
  className,
}: {
  entity?: object | null;
  title: string;
  label?: string;
  className?: string;
}) {
  const image = getEntityImage(entity);

  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border bg-muted/50",
        className,
      )}
    >
      {image ? (
        // Use a native image so API-hosted images work even when the domain is not listed in next.config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted/70">
          <div className="text-primary flex flex-col items-center gap-3 text-center">
            <div className="bg-card flex size-14 items-center justify-center rounded-3xl border border-border shadow-sm">
              <ImageIcon className="size-7" />
            </div>
            {label && <span className="text-sm font-bold">{label}</span>}
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-black/0" />
    </div>
  );
}
