"use client";

import { Lock, Mail, User } from "lucide-react";
import { ButtonLoading } from "@/components/custom/loading";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../ui/button";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { useTranslation } from "@/providers/TranslationsProvider";
import { getDirection } from "@/utils/translations/language-utils";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/services/auth.services/auth.query";
import { setCookie } from "@/utils/cookies";
import { myCookies } from "@/utils/cookies";
import { routesName } from "@/utils/constant";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { AxiosError } from "axios";
import { ApiError } from "@/types/common.type";
import { roleType } from "@/utils/enum/common.enum";
import { PhoneSelect } from "@/components/custom/phone-select";

// Country calling codes mapping (same as in phone-select.tsx)
const COUNTRY_CALLING_CODES: Record<string, string> = {
  US: "+1",
  GB: "+44",
  CA: "+1",
  AU: "+61",
  DE: "+49",
  FR: "+33",
  IT: "+39",
  ES: "+34",
  NL: "+31",
  BE: "+32",
  CH: "+41",
  AT: "+43",
  SE: "+46",
  NO: "+47",
  DK: "+45",
  FI: "+358",
  PL: "+48",
  CZ: "+420",
  GR: "+30",
  PT: "+351",
  IE: "+353",
  NZ: "+64",
  JP: "+81",
  CN: "+86",
  IN: "+91",
  KR: "+82",
  SG: "+65",
  MY: "+60",
  TH: "+66",
  ID: "+62",
  PH: "+63",
  VN: "+84",
  AE: "+971",
  SA: "+966",
  EG: "+20",
  ZA: "+27",
  BR: "+55",
  MX: "+52",
  AR: "+54",
  CL: "+56",
  CO: "+57",
  PE: "+51",
  TR: "+90",
  IL: "+972",
  RU: "+7",
  UA: "+380",
  SY: "+963", // Syria
};

// Helper function to get country code from calling code
const getCountryCodeFromCallingCode = (callingCode: string): string => {
  const entry = Object.entries(COUNTRY_CALLING_CODES).find(
    ([, code]) => code === callingCode,
  );
  return entry ? entry[0] : "US";
};

const SignUpForm = () => {
  const lang = useCurrentLang();
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const { auth } = useTranslation();
  const translations = auth.signUp;
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const registerMutation = useRegister();

  // Zod schema with custom validation messages
  const signUpSchema = z
    .object({
      firstName: z.string().min(1, translations.errors.allFieldsRequired),
      lastName: z.string().min(1, translations.errors.allFieldsRequired),
      email: z
        .string()
        .min(1, translations.errors.allFieldsRequired)
        .email(translations.errors.invalidEmail),
      countryCallingCode: z
        .string()
        .min(1, translations.errors.allFieldsRequired),
      phoneNumber: z
        .string()
        .min(1, translations.errors.allFieldsRequired)
        .refine(
          (phone) => {
            const cleanPhone = phone.replace(/\D/g, "");
            return cleanPhone.length >= 9 && cleanPhone.length <= 9;
          },
          { message: translations.errors.invalidPhone },
        ),
      password: z
        .string()
        .min(1, translations.errors.allFieldsRequired)
        .min(6, translations.errors.passwordLength),
      confirmPassword: z.string().min(1, translations.errors.allFieldsRequired),
      agreeToTerms: z.boolean().refine((val) => val === true, {
        message: translations.errors.agreeToTerms,
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: translations.errors.passwordMismatch,
      path: ["confirmPassword"],
    });

  type SignUpFormValues = z.infer<typeof signUpSchema>;

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCallingCode: "+963",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const response = await registerMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber, // Send phone number without country code
        countryCallingCode: data.countryCallingCode, // Send country calling code separately
        password: data.password,
        role: Number(roleType.STUDENT),
      });

      // Save token to cookie
      if (response.token) {
        setCookie(myCookies.auth, response.token, true);
      }

      // Redirect based on verification requirement
      if (response.requiresVerification) {
        // Redirect to verification page with phone number
        const verifyUrl = new URL(
          getLocalizedHref(routesName.verify.href),
          window.location.origin,
        );
        if (response.phoneNumber) {
          verifyUrl.searchParams.set("phoneNumber", response.phoneNumber);
        }
        if (response.email) {
          verifyUrl.searchParams.set("email", response.email);
        }
        router.push(verifyUrl.pathname + verifyUrl.search);
      } else {
        // Redirect to home or dashboard
        router.push(getLocalizedHref(routesName.home.href));
      }
    } catch (err: unknown) {
      // Handle error - form will show field errors automatically
      if (err instanceof AxiosError) {
        const errorData = err.response?.data as ApiError | undefined;

        if (errorData) {
          // Build error message with title and detail only
          const errorParts: string[] = [];

          if (errorData.title) {
            errorParts.push(errorData.title);
          }

          if (errorData.detail) {
            errorParts.push(errorData.detail);
          }

          // If we have both title and detail, join them
          const errorMessage =
            errorParts.length > 0
              ? errorParts.join(" - ")
              : errorData.title || "An unexpected error occurred";

          form.setError("root", { message: errorMessage });
        } else {
          form.setError("root", { message: "An unexpected error occurred" });
        }
      } else {
        form.setError("root", { message: "An unexpected error occurred" });
      }
    }
  };

  return (
    <div
      dir={direction}
      className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 dark:from-slate-900 dark:to-slate-800"
    >
      <div className="relative flex w-full max-w-xl flex-col items-center overflow-hidden rounded-3xl border border-slate-200/50 bg-white p-8 shadow-2xl dark:border-slate-700/50 dark:bg-slate-800">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div
          className={`absolute -top-10 ${isRTL ? "-left-10" : "-right-10"} h-26 w-26 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 opacity-50 dark:from-blue-900/30 dark:to-purple-900/30`}
        />
        <div
          className={`absolute -bottom-5 ${isRTL ? "-right-10" : "-left-10"} h-26 w-26 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 opacity-50 dark:from-purple-900/30 dark:to-blue-900/30`}
        />

        <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
          <Image
            src="/images/logo-light.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </div>
        <h2 className="mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-slate-100 dark:to-slate-300">
          {translations.title}
        </h2>
        <p className="mb-8 max-w-sm text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {translations.subtitle}
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative z-10 mb-4 flex w-full flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={translations.firstName}
                        type="text"
                        startIcon={<User className="h-5 w-5" />}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={translations.lastName}
                        type="text"
                        startIcon={<User className="h-5 w-5" />}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={translations.email}
                      type="email"
                      startIcon={<Mail className="h-5 w-5" />}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Controller
                control={form.control}
                name="countryCallingCode"
                render={({ field: countryField }) => (
                  <Controller
                    control={form.control}
                    name="phoneNumber"
                    render={({ field: phoneField }) => (
                      <FormItem>
                        <FormControl>
                          <PhoneSelect
                            value={{
                              countryCode: countryField.value
                                ? getCountryCodeFromCallingCode(
                                    countryField.value,
                                  )
                                : "US",
                              phoneNumber: phoneField.value || "",
                            }}
                            onChange={(value) => {
                              const callingCode =
                                COUNTRY_CALLING_CODES[value.countryCode] ||
                                "+1";
                              countryField.onChange(callingCode);
                              phoneField.onChange(value.phoneNumber);
                            }}
                            phoneNumberPlaceholder={translations.phoneNumber}
                            error={
                              !!form.formState.errors.phoneNumber ||
                              !!form.formState.errors.countryCallingCode
                            }
                          />
                        </FormControl>
                        {form.formState.errors.phoneNumber && (
                          <FormMessage>
                            {form.formState.errors.phoneNumber.message}
                          </FormMessage>
                        )}
                        {form.formState.errors.countryCallingCode && (
                          <FormMessage>
                            {form.formState.errors.countryCallingCode.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={translations.password}
                      type="password"
                      startIcon={<Lock className="h-5 w-5" />}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={translations.confirmPassword}
                      type="password"
                      startIcon={<Lock className="h-5 w-5" />}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-start text-xs text-red-500 dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-400">
                {form.formState.errors.root.message}
              </div>
            )}

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex w-full items-center gap-2">
                    <FormControl>
                      <Checkbox
                        id="agreeToTerms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="text-primary focus:ring-primary/20 h-4 w-4 rounded border-slate-300 focus:ring-2 focus:ring-offset-0 dark:border-slate-600"
                      />
                    </FormControl>
                    <label
                      htmlFor="agreeToTerms"
                      className="cursor-pointer text-sm text-slate-600 dark:text-slate-300"
                    >
                      {translations.agreeToTerms}
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <ButtonLoading />
                  {translations.signingUp}
                </>
              ) : (
                translations.signUpButton
              )}
            </Button>
          </form>
        </Form>

        <div className="relative z-10 my-4 flex w-full items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          <span className="mx-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            {translations.orContinueWith}
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
        </div>

        <div className="relative z-10 w-full">
          <Button variant={"outline"} className="w-full">
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {translations.signUpWithGoogle}
            </span>
          </Button>
        </div>
        <div
          className={`relative z-10 mt-4 w-full text-sm ${isRTL ? "text-start" : "text-center"}`}
        >
          <span className="text-slate-600 dark:text-slate-300">
            {translations.haveAccount}{" "}
          </span>
          <Link
            href={`/${lang}/sign-in`}
            className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 font-medium transition-colors hover:underline"
          >
            {translations.goToSignIn}
          </Link>
        </div>
      </div>
    </div>
  );
};

export { SignUpForm };
