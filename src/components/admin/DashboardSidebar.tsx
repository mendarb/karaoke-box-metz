import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, Users, FileText, Layout } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Layout,
  },
  {
    title: "Calendrier",
    href: "/admin/calendar",
    icon: Calendar,
  },
  {
    title: "Comptes",
    href: "/admin/accounts",
    icon: Users,
  },
  {
    title: "Landing Pages",
    href: "/admin/landing-pages",
    icon: FileText,
  },
  {
    title: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
  },
];

export const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r shadow-sm">
      <div className="flex flex-col h-full py-6">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start mb-1",
                    isActive && "bg-violet-100 text-violet-700 hover:bg-violet-200"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};