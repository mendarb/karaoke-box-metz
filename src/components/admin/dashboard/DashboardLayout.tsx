import { ReactNode } from "react";
import { DashboardSidebar } from "../DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;  // Make title optional
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {title && (
            <h1 className="text-2xl font-semibold mb-6">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};