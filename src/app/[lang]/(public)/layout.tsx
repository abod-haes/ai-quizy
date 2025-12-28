import React from "react";
import { ConditionalHeader } from "@/components/base/layout/conditional-header";
import { ConditionalFooter } from "@/components/base/layout/conditional-footer";
import { QrActivationButton } from "@/components/custom/qr-activation-button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-background flex min-h-screen flex-col justify-between">
      <ConditionalHeader />
      <QrActivationButton />

      <div className="flex flex-1 flex-col">{children}</div>
      <ConditionalFooter />
    </div>
  );
};

export default Layout;
