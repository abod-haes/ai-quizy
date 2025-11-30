import React, { Suspense } from "react";
import { VerificationCodeForm } from "@/components/section/public/auth/verification-code";
import { Loader2 } from "lucide-react";

function VerifyPageContent() {
  return <VerificationCodeForm />;
}

async function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyPageContent />
    </Suspense>
  );
}

export default VerifyPage;

