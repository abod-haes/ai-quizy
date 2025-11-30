"use client";

import React from "react";
import sanitizeHtml from "sanitize-html";
import { cn } from "@/lib/utils";

interface HtmlContentProps {
  html: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function HtmlContent({
  html,
  className,
  as: Component = "div",
}: HtmlContentProps) {
  if (!html) return null;

  // Sanitize HTML to prevent XSS attacks
  // Allow common HTML tags used in mathematical formulas and content
  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "span",
      "div",
      "strong",
      "em",
      "u",
      "sub",
      "sup",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
    ],
    allowedAttributes: {
      "*": ["class", "id", "style", "data-*"],
      span: ["class", "id", "style", "data-*"],
      p: ["class", "id", "style", "data-*"],
      div: ["class", "id", "style", "data-*"],
    },
    allowedStyles: {
      "*": {
        color: [/^#[0-9A-Fa-f]{6}$/, /^rgb/, /^rgba/],
        "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
        "font-size": [/^\d+(?:px|em|rem|%)$/],
        "font-weight": [/^\d+$/, /^bold$/, /^normal$/],
      },
    },
  });

  const ComponentElement = Component as React.ElementType;

  return (
    <ComponentElement
      className={cn(
        "html-content [&_p]:mb-2 [&_p]:leading-relaxed [&_p:last-child]:mb-0 [&_sub]:align-sub [&_sub]:text-xs [&_sup]:align-super [&_sup]:text-xs",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
