"use client";

import React, { useMemo } from "react";
import sanitizeHtml from "sanitize-html";
import { MathJax } from "better-react-mathjax";
import { renderQuizHtml } from "@/utils/mathjax-utils";
import { cn } from "@/lib/utils";

interface MathJaxContentProps {
  html: string;
  className?: string;
}

export const MathJaxContent = React.memo(function MathJaxContent({
  html,
  className,
}: MathJaxContentProps) {
  const sanitizedHtml = useMemo(() => {
    if (!html) return "";
    const processed = renderQuizHtml(html); // convert <MathLm>..</MathLm> => \(..\)
    return sanitizeHtml(processed, {
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
        "ul",
        "ol",
        "li",
        "blockquote",
        "code",
        "pre",
      ],
      allowedAttributes: { "*": ["class", "id", "style", "data-*", "dir"] },
    });
  }, [html]);

  return (
    <MathJax>
      <div
        className={cn(
          "mathjax-content [&_p]:mb-2 [&_p]:leading-relaxed [&_p:last-child]:mb-0 [&_sub]:align-sub [&_sub]:text-xs [&_sup]:align-super [&_sup]:text-xs",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </MathJax>
  );
});
