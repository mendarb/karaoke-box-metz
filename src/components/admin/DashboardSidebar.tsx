import { Home, Calendar, Settings, LogOut, ArrowLeft } from "lucide-react";
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

  return (
    <div className={`h-full bg-card flex flex-col border-r relative ${isMobile ? 'min-h-screen' : ''}`}>
      <div className="p-4 mb-4">
        <h2 className="text-lg font-semibold px-4">Karaoke Admin</h2>
      </div>

      <nav className="space-y-2 flex-1 p-4">
        <Button 
          variant={isActive("/admin") ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => navigate("/admin")}
        >
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button 
          variant={isActive("/admin/calendar") ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => navigate("/admin/calendar")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Calendrier
        </Button>
        <Button 
          variant={isActive("/admin/settings") ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => navigate("/admin/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
      </nav>

      <div className="border-t bg-card p-4">
        <Button
          variant="ghost"
          className="w-full justify-start mb-2"
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