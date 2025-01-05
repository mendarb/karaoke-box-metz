import { DashboardSidebar } from "./DashboardSidebar";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};