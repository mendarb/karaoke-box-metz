import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="md:pl-64">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};