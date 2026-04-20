import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

import type { ReactNode } from "react";

export const PageWrapper = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-white lg:pt-[118px]">
    <Navbar />
    <div className="flex flex-col lg:flex-row">
      <Sidebar />
      <main className="min-h-screen flex-1 bg-white p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-8">{children}</main>
    </div>
  </div>
);
