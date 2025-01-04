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
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={location.pathname === item.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start")}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};