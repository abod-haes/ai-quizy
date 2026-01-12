import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function buildQueryString(
  params?:
    | Record<string, string | number | boolean | undefined | null>
    | object,
): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
export function htmlToPlainText(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Convert MathLm tags to their inner text
  doc.querySelectorAll("MathLm").forEach((node) => {
    const text = node.textContent;
    node.replaceWith(text);
  });

  return doc.body.textContent.trim();
}