/**
 * Converts <MathLm>...</MathLm> tags to MathJax inline format \(...\)
 * Note: The JSON should contain \\frac, but when rendered as a string in JS,
 * it will automatically become \frac
 */
export function renderQuizHtml(raw: string): string {
  if (!raw) return "";

  // Replace <MathLm>...</MathLm> with \(...\)
  const withMathJax = raw.replace(
    /<MathLm>([\s\S]*?)<\/MathLm>/g,
    (_, latex) => `\\(${latex}\\)`,
  );

  return withMathJax;
}

