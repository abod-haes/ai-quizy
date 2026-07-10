"use client";

import React, { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const imageKeys = [
  "primaryImage",
  "mainImage",
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

function makeImageUrl(value: string) {
  const cleanValue = value.trim();
  if (!cleanValue) return undefined;

  const hasProtocol = /^[a-z][a-z0-9+.-]*:/i.test(cleanValue);
  if (hasProtocol) return cleanValue;

  if (cleanValue.startsWith("//")) return `https:${cleanValue}`;

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!apiBase) return cleanValue;

  return `${apiBase}/${cleanValue.replace(/^\//, "")}`;
}

function getNestedUrl(value: unknown): string | undefined {
  if (typeof value === "string") return makeImageUrl(value);

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    const nestedKeys = ["url", "src", "path", "imageUrl"];

    for (const key of nestedKeys) {
      const nestedValue = objectValue[key];
      if (typeof nestedValue === "string") {
        const imageUrl = makeImageUrl(nestedValue);
        if (imageUrl) return imageUrl;
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

function EntityImageFallback({ label }: { label?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted/70">
      <div className="text-primary flex flex-col items-center gap-2 text-center">
        <div className="bg-card flex size-11 items-center justify-center rounded-2xl border border-border shadow-sm">
          <ImageIcon className="size-5" />
        </div>
        {label && <span className="text-xs font-bold">{label}</span>}
      </div>
    </div>
  );
}

export function EntityCover({
  entity,
  title,
  label,
  className,
  fit = "cover",
}: {
  entity?: object | null;
  title: string;
  label?: string;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const image = getEntityImage(entity);
  const [hasImageError, setHasImageError] = useState(false);
  const showImage = image && !hasImageError;

  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted/50",
        className,
      )}
    >
      {showImage ? (
        <img
          key={image}
          src={image}
          alt={title}
          loading="lazy"
          onError={() => setHasImageError(true)}
          className={cn(
            "h-full w-full object-center transition-transform duration-500 group-hover:scale-105",
            fit === "contain" ? "object-contain" : "object-cover",
          )}
        />
      ) : (
        <EntityImageFallback label={label} />
      )}
      <div className="pointer-events-none absolute inset-0 bg-black/0" />
    </div>
  );
}
