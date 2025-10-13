import React from "react";
import { ConditionalHeader } from "@/components/base/layout/conditional-header";
import { ConditionalFooter } from "@/components/base/layout/conditional-footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main>
      <ConditionalHeader />
      {children}
      <ConditionalFooter />
    </main>
  );
};

export default Layout;
