import { ReactNode } from "react";
import { DashboardSidebar } from "../DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 md:ml-56">
        <main className="p-4 md:p-6 pt-16 md:pt-6">
          {title && (
            <h1 className="text-2xl font-semibold mb-6">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};