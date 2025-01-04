import { DashboardSidebar } from "../DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        {children}
      </div>
    </div>
  );
};