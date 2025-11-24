"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Lock, Phone } from "lucide-react";
import { Button } from "../../../ui/button";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { useTranslation } from "@/providers/TranslationsProvider";
import { getDirection } from "@/utils/translations/language-utils";
import { Input } from "@/components/ui/input";

const SignInForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const lang = useCurrentLang();
  const { auth } = useTranslation();
  const translations = auth.signIn;
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  };

  const handleSignIn = () => {
    if (!phoneNumber || !password) {
      setError(translations.errors.phonePasswordRequired);
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      setError(translations.errors.invalidPhone);
      return;
    }
    setError("");
    alert(translations.errors.signInSuccess);
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
        <div className="relative z-10 mb-4 flex w-full flex-col gap-4">
          <div className="relative">
            <Input
              placeholder={translations.phoneNumber}
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              dir={isRTL ? "rtl" : "ltr"}
              startIcon={<Phone className="h-5 w-5" />}
            />
          </div>
          <div className="relative">
            <Input
              placeholder={translations.password}
              type="password"
              value={password}
              startIcon={<Lock className="h-5 w-5" />}
              onChange={(e) => setPassword(e.target.value)}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          {error && (
            <div
              className={`rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-500 ${isRTL ? "text-start" : "text-start"}`}
            >
              {error}
            </div>
          )}

          <div
            className={`flex w-full flex-row items-center ${isRTL ? "flex-row-reverse justify-between" : "justify-between"}`}
          >
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-600">
                {translations.rememberMe}
              </span>
            </label>
            <button className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline">
              {translations.forgotPassword}
            </button>
          </div>
        </div>
        <Button onClick={handleSignIn} className="w-full">
          {translations.signInButton}
        </Button>

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
