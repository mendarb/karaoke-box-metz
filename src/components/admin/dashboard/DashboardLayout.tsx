import { ReactNode } from "react";
import { DashboardSidebar } from "../DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-3 md:p-6 pb-20 md:pb-6">
          {title && (
            <h1 className="text-lg font-medium mb-4">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};