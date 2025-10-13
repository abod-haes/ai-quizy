import { Lang } from "./translations/dictionary-utils";

export function formatPrice(priceCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

/**
 * Localizes an array of options by replacing labels with translations from a dictionary.
 * If a translation is not found, the original label is kept.
 *
 * @param {Array<{label: string, value: string}>} options - The options to localize.
 * @param {Record<string, string>} dict - A dictionary mapping original labels to translated labels.
 * @returns {Array<{label: string, value: string}>} - The localized options.
 *
 * @example
 * const options = [{ label: "apple", value: "1" }, { label: "banana", value: "2" }];
 * const dict = { apple: "تفاح", banana: "موز" };
 * const localized = getLocalizedOptions(options, dict);
 * // Output: [{ label: "تفاح", value: "1" }, { label: "موز", value: "2" }]
 */
export function getLocalizedOptions(
  optoins: { label: string; value: string }[],
  dict: Record<string, string>,
) {
  return optoins.map((option) => ({
    ...option,
    label: dict?.[option.label] || option.label,
  }));
}

/**
 * Removes the Arabic definite article "ال" from the beginning of a word if the language is Arabic.
 * If the language is not Arabic, the word is returned unchanged.
 *
 * @param {string} word - The word to process.
 * @param {Lang} lang - The language code (e.g., "ar" for Arabic).
 * @returns {string} - The word without "ال" prefix (if applicable).
 *
 * @example
 * removeAl("الكتاب", "ar"); // Returns "كتاب"
 * removeAl("book", "en");   // Returns "book"
 */
export function removeAl(word: string, lang: Lang) {
  if (lang === "ar") {
    return word.slice(2);
  }
  return word;
}
