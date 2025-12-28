import { z } from "zod";

interface SignInTranslations {
  phonePasswordRequired: string;
  invalidPhone: string;
  allFieldsRequired: string;
}

export const createSignInSchema = (translations: SignInTranslations) => {
  return z.object({
    countryCallingCode: z
      .string()
      .min(1, translations.allFieldsRequired || translations.phonePasswordRequired),
    phoneNumber: z
      .string()
      .min(1, translations.phonePasswordRequired)
      .refine(
        (phone) => {
          const cleanPhone = phone.replace(/\D/g, "");
          return cleanPhone.length >= 9 && cleanPhone.length <= 9;
        },
        { message: translations.invalidPhone },
      ),
    password: z.string().min(1, translations.phonePasswordRequired),
    rememberMe: z.boolean().optional(),
  });
};

export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>>;
