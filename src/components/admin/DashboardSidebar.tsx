import { Home, Calendar, Settings, LogOut, ArrowLeft, BookOpen, Users, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/admin", icon: Home, label: "Dashboard" },
    { path: "/admin/calendar", icon: Calendar, label: "Calendrier" },
    { path: "/admin/accounts", icon: Users, label: "Comptes" },
    { path: "/admin/settings", icon: Settings, label: "Paramètres" },
    { path: "/admin/documentation", icon: BookOpen, label: "Documentation" },
  ];

  return (
    <div className={`h-full bg-card flex flex-col border-r relative ${isMobile ? 'min-h-screen' : ''}`}>
      <div className="p-4 mb-4 border-b">
        <h2 className="text-lg font-semibold px-4">Karaoke Admin</h2>
      </div>

      <nav className="space-y-2 flex-1 p-4">
        {menuItems.map((item) => (
          <Button 
            key={item.path}
            variant={isActive(item.path) ? "secondary" : "ghost"} 
            className="w-full justify-between" 
            onClick={() => navigate(item.path)}
          >
            <span className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </span>
            {isMobile && <ChevronRight className="h-4 w-4 opacity-50" />}
          </Button>
        ))}
      </nav>

      <div className="border-t bg-card p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au formulaire
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};