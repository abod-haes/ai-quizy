"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useSearchParamsState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const getParamAsNumber = useCallback(
    (key: string, defaultValue: number = 0): number => {
      const value = searchParams.get(key);
      return value ? Number(value) : defaultValue;
    },
    [searchParams],
  );

  const getParamAsBoolean = useCallback(
    (key: string): boolean | undefined => {
      const value = searchParams.get(key);
      if (value === null) return undefined;
      return value === "true";
    },
    [searchParams],
  );

  const setParam = useCallback(
    (key: string, value: string | number | boolean | null | undefined) => {
      console.log("[useSearchParams] setParam:", { key, value });
      const params = new URLSearchParams(searchParams.toString());
      const before = params.toString();

      if (value === null || value === undefined || value === "") {
        params.delete(key);
        console.log("[useSearchParams] Deleted param:", key);
      } else {
        params.set(key, String(value));
        console.log("[useSearchParams] Set param:", key, "=", value);
      }

      const after = params.toString();
      const newUrl = `?${after}`;
      console.log("[useSearchParams] URL update:", { before, after, newUrl });

      router.push(newUrl, { scroll: false });
    },
    [router, searchParams],
  );

  const setParams = useCallback(
    (
      newParams: Record<string, string | number | boolean | null | undefined>,
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const clearParams = useCallback(() => {
    router.push("?", { scroll: false });
  }, [router]);

  const clearParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const getAllParams = useCallback(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  return {
    getParam,
    getParamAsNumber,
    getParamAsBoolean,
    setParam,
    setParams,
    clearParams,
    clearParam,
    getAllParams,
    searchParams,
  };
}
