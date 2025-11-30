import React from "react";
import { ConditionalHeader } from "@/components/base/layout/conditional-header";
import { ConditionalFooter } from "@/components/base/layout/conditional-footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="bg-background flex min-h-screen flex-col justify-between">
      <ConditionalHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <ConditionalFooter />
    </main>
  );
};

export default Layout;
