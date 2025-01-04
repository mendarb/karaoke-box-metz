import { DashboardSidebar } from "../DashboardSidebar";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 p-8 pt-24">
        {children}
      </div>
    </div>
  );
};