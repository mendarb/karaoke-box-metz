import { DashboardSidebar } from "../DashboardSidebar";
import { Layout, FileText } from "lucide-react";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <Layout className="h-4 w-4" />,
    },
    {
      title: "Landing Pages",
      href: "/admin/landing-pages",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar items={sidebarItems} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};
