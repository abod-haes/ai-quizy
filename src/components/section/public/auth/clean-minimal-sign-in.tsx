"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { ButtonLoading } from "@/components/custom/loading";
import { Button } from "../../../ui/button";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { useTranslation } from "@/providers/TranslationsProvider";
import { getDirection } from "@/utils/translations/language-utils";
import { Input } from "@/components/ui/input";
import {
  PhoneSelect,
  COUNTRY_CALLING_CODES,
} from "@/components/custom/phone-select";
import { useLogin } from "@/hooks/api/auth.query";
import { setCookie } from "@/utils/cookies";
import { myCookies } from "@/utils/cookies";
import { routesName, dashboardRoutesName } from "@/utils/constant";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { AxiosError } from "axios";
import { ApiError } from "@/types/common.type";
import {
  createSignInSchema,
  type SignInFormValues,
} from "@/validation/sign-in.schema";
import { roleType } from "@/utils/enum/common.enum";
import { toast } from "sonner";

// Create reverse mapping for faster lookup (country code -> calling code)
const CALLING_CODE_TO_COUNTRY_CODE: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  Object.entries(COUNTRY_CALLING_CODES).forEach(([country, code]) => {
    map[code] = country;
  });
  return map;
})();

const SignInForm = () => {
  const lang = useCurrentLang();
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const { auth } = useTranslation();
  const translations = auth.signIn;
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const loginMutation = useLogin();

  // Zod schema with custom validation messages
  const signInSchema = createSignInSchema({
    phonePasswordRequired: translations.errors.phonePasswordRequired,
    invalidPhone: translations.errors.invalidPhone,
    allFieldsRequired: translations.errors.allFieldsRequired,
  });

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      countryCallingCode: "+963", // Default to Syria
      phoneNumber: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const response = await loginMutation.mutateAsync({
        phoneNumber: data.phoneNumber, // Send phone number without country code
        countryCallingCode: data.countryCallingCode, // Send country calling code separately
        password: data.password,
      });

      // Save token to cookie
      if (response.token) {
        setCookie(myCookies.auth, response.token, true);
      }

      // Show success toast
      toast.success(translations.errors.signInSuccess || "Sign in successful!");

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
        // Check user role and redirect accordingly
        const userRole = parseInt(response.role, 10);
        if (userRole === roleType.ADMIN) {
          // Admin users go to dashboard
          router.push(getLocalizedHref(dashboardRoutesName.dashboard.href));
        } else {
          // Other users go to home
          router.push(getLocalizedHref(routesName.home.href));
        }
      }
    } catch (err: unknown) {
      // Handle error
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
      className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 dark:from-slate-900 dark:to-slate-800"
      dir={direction}
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
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field: phoneField }) => (
                <FormField
                  control={form.control}
                  name="countryCallingCode"
                  render={({ field: countryField }) => {
                    // Fast lookup using pre-computed reverse mapping
                    const countryCode =
                      CALLING_CODE_TO_COUNTRY_CODE[countryField.value] || "SY";

                    return (
                      <FormItem>
                        <FormControl>
                          <PhoneSelect
                            value={{
                              countryCode,
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
                        <FormMessage />
                        {form.formState.errors.countryCallingCode && (
                          <FormMessage>
                            {form.formState.errors.countryCallingCode.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    );
                  }}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={translations.password}
                      type="password"
                      dir={isRTL ? "rtl" : "ltr"}
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

            <div
              className={`flex w-full flex-row items-center ${isRTL ? "flex-row-reverse justify-between" : "justify-between"}`}
            >
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          id="rememberMe"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="text-primary focus:ring-primary/20 h-4 w-4 rounded border-slate-300 focus:ring-2 focus:ring-offset-0 dark:border-slate-600"
                        />
                      </FormControl>
                      <label
                        htmlFor="rememberMe"
                        className="cursor-pointer text-sm text-slate-600 dark:text-slate-300"
                      >
                        {translations.rememberMe}
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="button"
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {translations.forgotPassword}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <ButtonLoading />
                  {translations.signingIn}
                </>
              ) : (
                translations.signInButton
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
              {translations.signInWithGoogle}
            </span>
          </Button>
        </div>

        <div className={`relative z-10 mt-4 w-full text-sm`}>
          <span className="text-slate-600 dark:text-slate-300">
            {translations.noAccount}{" "}
          </span>
          <Link
            href={`/${lang}/sign-up`}
            className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            {translations.goToSignUp}
          </Link>
        </div>
      </div>
    </div>
  );
};

export { SignInForm };
