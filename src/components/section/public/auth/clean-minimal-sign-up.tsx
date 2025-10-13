"use client";

import { Lock, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../../../ui/button";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { useTranslation } from "@/providers/TranslationsProvider";
import { getDirection } from "@/utils/translations/language-utils";
import { Input } from "@/components/ui/input";

const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");

  const lang = useCurrentLang();
  const { auth } = useTranslation();
  const translations = auth.signUp;
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  };

  const handleSignUp = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      setError(translations.errors.allFieldsRequired);
      return;
    }
    if (!validateEmail(email)) {
      setError(translations.errors.invalidEmail);
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      setError(translations.errors.invalidPhone);
      return;
    }
    if (password !== confirmPassword) {
      setError(translations.errors.passwordMismatch);
      return;
    }
    if (password.length < 6) {
      setError(translations.errors.passwordLength);
      return;
    }
    if (!agreeToTerms) {
      setError(translations.errors.agreeToTerms);
      return;
    }
    setError("");
    alert(translations.errors.signUpSuccess);
  };

  return (
    <div
      dir={direction}
      className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4"
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
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder={translations.firstName}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              startIcon={<User className="h-5 w-5" />}
            />
            <Input
              placeholder={translations.lastName}
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              startIcon={<User className="h-5 w-5" />}
            />
          </div>
          <Input
            placeholder={translations.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startIcon={<Mail className="h-5 w-5" />}
          />
          <Input
            placeholder={translations.phoneNumber}
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            startIcon={<Phone className="h-5 w-5" />}
          />
          <Input
            placeholder={translations.password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startIcon={<Lock className="h-5 w-5" />}
          />
          <Input
            placeholder={translations.confirmPassword}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            startIcon={<Lock className="h-5 w-5" />}
          />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-left text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="flex w-full items-center gap-2">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="text-primary focus:ring-primary/20 h-4 w-4 rounded border-slate-300 focus:ring-2 focus:ring-offset-0"
            />
            <label className="cursor-pointer text-sm text-slate-600">
              {translations.agreeToTerms}
            </label>
          </div>
        </div>
        <Button onClick={handleSignUp} className="w-full">
          {translations.signUpButton}
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
              {translations.signUpWithGoogle}
            </span>
          </Button>
        </div>
        <div
          className={`relative z-10 mt-4 w-full text-sm ${isRTL ? "text-right" : "text-center"}`}
        >
          <span className="text-slate-600">{translations.haveAccount} </span>
          <Link
            href={`/${lang}/sign-in`}
            className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
          >
            {translations.goToSignIn}
          </Link>
        </div>
      </div>
    </div>
  );
};

export { SignUpForm };
