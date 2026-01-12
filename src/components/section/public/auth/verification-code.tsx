"use client";

import { Mail, Phone } from "lucide-react";
import { ButtonLoading } from "@/components/custom/loading";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Button } from "../../../ui/button";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { useTranslation } from "@/providers/TranslationsProvider";
import { getDirection } from "@/utils/translations/language-utils";
import { useVerifyCode } from "@/services/auth.services/auth.query";
import { routesName, dashboardRoutesName } from "@/utils/constant";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { setCookie } from "@/utils/cookies";
import { myCookies } from "@/utils/cookies";
import { AxiosError } from "axios";
import { ApiError } from "@/types/common.type";
import { roleType } from "@/utils/enum/common.enum";

const VerificationCodeForm = () => {
  const lang = useCurrentLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const getLocalizedHref = useLocalizedHref();
  const { auth } = useTranslation();
  const translations = auth.verification;
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const phoneNumber = searchParams.get("phoneNumber");
  const email = searchParams.get("email");

  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyMutation = useVerifyCode();

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d{1,4}$/.test(pastedData)) {
      const newCode = [...code];
      for (let i = 0; i < 4; i++) {
        newCode[i] = pastedData[i] || "";
      }
      setCode(newCode);
      // Focus the last filled input or the last input
      const lastIndex = Math.min(pastedData.length - 1, 3);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleSubmit = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 4) {
      setError(translations.errors.invalidCode);
      return;
    }

    if (!phoneNumber) {
      setError(translations.errors.missingPhoneNumber);
      return;
    }

    try {
      const response = await verifyMutation.mutateAsync({
        phoneNumber,
        otpCode: verificationCode,
      });

      // Save token to cookie
      if (response.token) {
        setCookie(myCookies.auth, response.token, true);
      }

      // Check user role and redirect accordingly
      const userRole = parseInt(response.role, 10);
      if (userRole === roleType.ADMIN) {
        // Admin users go to dashboard
        router.push(getLocalizedHref(dashboardRoutesName.dashboard.href));
      } else {
        // Other users go to home
        router.push(getLocalizedHref(routesName.home.href));
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
              : errorData.title ||
                translations.errors.verificationFailed ||
                "Verification failed";

          setError(errorMessage);
        } else {
          setError(
            translations.errors.verificationFailed || "Verification failed",
          );
        }
      } else {
        setError(
          translations.errors.verificationFailed || "Verification failed",
        );
      }
    }
  };

  const handleResend = async () => {
    // TODO: Implement resend code functionality
    alert(translations.resendCode || "Code resent!");
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
        <p className="mb-2 max-w-sm text-center text-sm leading-relaxed text-slate-500">
          {translations.subtitle}
        </p>
        {(phoneNumber || email) && (
          <p className="mb-8 text-center text-sm font-medium text-slate-700">
            {phoneNumber && (
              <span className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                {phoneNumber}
              </span>
            )}
            {email && (
              <span className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                {email}
              </span>
            )}
          </p>
        )}

        <div className="relative z-10 mb-4 flex w-full flex-col gap-4">
          {/* 4-digit code inputs */}
          <div className="flex justify-center gap-2" dir={"ltr"}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="focus:border-primary focus:ring-primary/50 dark:bg-input/30 h-14 w-14 rounded-xl border-2 border-slate-300 bg-slate-50/50 text-center text-2xl font-bold text-slate-800 shadow-xs transition-all duration-200 focus:ring-[3px] focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-xs text-red-500">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={verifyMutation.isPending || code.join("").length !== 4}
          >
            {verifyMutation.isPending ? (
              <>
                <ButtonLoading />
                {translations.verifying}
              </>
            ) : (
              translations.verifyButton
            )}
          </Button>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-slate-600">
              {translations.didntReceiveCode}
            </span>
            <button
              type="button"
              onClick={handleResend}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors hover:underline"
            >
              {translations.resendCode}
            </button>
          </div>
        </div>

        <div
          className={`relative z-10 mt-4 w-full text-sm ${isRTL ? "text-start" : "text-center"}`}
        >
          <span className="text-slate-600">{translations.backToSignIn} </span>
          <Link
            href={getLocalizedHref(routesName.signin.href)}
            className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
          >
            {translations.signInLink}
          </Link>
        </div>
      </div>
    </div>
  );
};

export { VerificationCodeForm };
