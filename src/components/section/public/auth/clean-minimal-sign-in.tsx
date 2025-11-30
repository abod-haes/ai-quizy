"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Phone, Loader2 } from "lucide-react";
import { Button } from "../../../ui/button";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { useTranslation } from "@/providers/TranslationsProvider";
import { getDirection } from "@/utils/translations/language-utils";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/api/auth.query";
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
import { Checkbox } from "@/components/ui/checkbox";
import { AxiosError } from "axios";
import { ApiError } from "@/types/common.type";
import {
  createSignInSchema,
  type SignInFormValues,
} from "@/validation/sign-in.schema";

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
  });

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const response = await loginMutation.mutateAsync({
        phoneNumber: data.phoneNumber,
        password: data.password,
      });

      // Save token to cookie
      if (response.token) {
        setCookie(myCookies.auth, response.token, true);
      }

      // Redirect based on verification requirement
      if (response.requiresVerification) {
        // Redirect to verification page with phone number
        const verifyUrl = new URL(
          getLocalizedHref(routesName.verify),
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
        router.push(getLocalizedHref(routesName.home));
      }
    } catch (err: unknown) {
      // Handle error
      if (err instanceof AxiosError) {
        const errorData = err.response?.data as ApiError | undefined;

        if (errorData) {
          // Extract error message from the new error structure
          let errorMessage = errorData.title || "An unexpected error occurred";

          // Handle validation errors (new format with errors object)
          if (errorData.errors && Object.keys(errorData.errors).length > 0) {
            // Get first error message from the first field
            const firstField = Object.keys(errorData.errors)[0];
            const firstError = errorData.errors[firstField]?.[0];
            if (firstError) {
              errorMessage = firstError;
            }
          }

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
      className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4"
      dir={direction}
    >
      <div className="relative flex w-full max-w-xl flex-col items-center overflow-hidden rounded-3xl border border-slate-200/50 bg-white p-8 shadow-2xl">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div
          className={`absolute -top-10 ${isRTL ? "-left-10" : "-right-10"} h-26 w-26 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 opacity-50`}
        />
        <div
          className={`absolute -bottom-5 ${isRTL ? "-right-10" : "-left-10"} h-26 w-26 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 opacity-50`}
        />

        <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
          <Image
            src="/images/logo-light.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </div>
        <h2 className="mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-center text-3xl font-bold text-transparent">
          {translations.title}
        </h2>
        <p className="mb-8 max-w-sm text-center text-sm leading-relaxed text-slate-500">
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
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={translations.phoneNumber}
                      type="tel"
                      dir={isRTL ? "rtl" : "ltr"}
                      startIcon={<Phone className="h-5 w-5" />}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-left text-xs text-red-500">
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
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="text-primary focus:ring-primary/20 h-4 w-4 rounded border-slate-300 focus:ring-2 focus:ring-offset-0"
                        />
                      </FormControl>
                      <label className="cursor-pointer text-sm text-slate-600">
                        {translations.rememberMe}
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="button"
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {translations.signingIn}
                </>
              ) : (
                translations.signInButton
              )}
            </Button>
          </form>
        </Form>

        <div className="relative z-10 my-4 flex w-full items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="mx-4 text-sm font-medium text-slate-500">
            {translations.orContinueWith}
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
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
            <span className="text-sm font-medium text-slate-700">
              {translations.signInWithGoogle}
            </span>
          </Button>
        </div>

        <div className={`relative z-10 mt-4 w-full text-sm`}>
          <span className="text-slate-600">{translations.noAccount} </span>
          <Link
            href={`/${lang}/sign-up`}
            className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            {translations.goToSignUp}
          </Link>
        </div>
      </div>
    </div>
  );
};

export { SignInForm };
