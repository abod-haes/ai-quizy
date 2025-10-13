"use client";

import FullPageError from "@/components/custom/full-page-error";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="flex h-full flex-1 items-center justify-center p-4">
      <FullPageError errorMessage={error?.message} displayGoHome />
    </div>
  );
}
