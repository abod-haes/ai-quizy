export const i18n = {
  defaultLang: "ar",
  langs: ["ar", "en"] as const,
};

export type Lang = (typeof i18n.langs)[number];

const rawDictionaries = {
  en: () => import("@/dictionaries/en.json").then((r) => r.default),
  ar: () => import("@/dictionaries/ar.json").then((r) => r.default),
} as const;

export type Dictionaries = typeof rawDictionaries;

export const dictionaries: Dictionaries = rawDictionaries;

// Type for the complete dictionary structure
export type CompleteDictionary = Awaited<ReturnType<Dictionaries["en"]>>;

// Type for accessing specific sections of the dictionary
export type DictionaryFor<K extends keyof CompleteDictionary> =
  CompleteDictionary[K];

// Function to get the complete dictionary for a language
export async function getDictionary(lang: string): Promise<CompleteDictionary> {
  if (!i18n.langs.includes(lang as Lang)) {
    lang = i18n.defaultLang as Lang;
  }
  return dictionaries[lang as Lang]() as Promise<CompleteDictionary>;
}

// Helper function to get a specific section of the dictionary
export async function getDictionarySection<
    L extends Lang,
  K extends keyof CompleteDictionary,
>(lang: L, section: K): Promise<DictionaryFor<K>> {
  const dictionary = await getDictionary(lang);
  return dictionary[section];
}

/**
 * Replaces {{placeholder}} tokens in a string with given values.
 *
 * @example
 * fmt("Hello {{user}}", { user: "Alice" }) // => "Hello Alice"
 * fmt("Delete {{entity}}?", { entity: "user" }) // => "Delete user?"
 *
 * @param message - The template string containing {{key}} placeholders
 * @param options - Key-value pairs to replace placeholders (undefined values are skipped)
 * @returns The interpolated string
 */

interface Options {
  [key: string]: string | number | boolean | undefined;
  femaleArabicField?: boolean;
}

export function fmt(message: string, options: Options = {}): string {
  let result = message;
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      result = result.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, "g"),
        String(value),
      );
    }
  });
  return result;
}
