import { DashboardSidebar } from "../DashboardSidebar";
import { Layout, FileText } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
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
      <DashboardSidebar sidebarItems={sidebarItems} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};