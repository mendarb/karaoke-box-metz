import { Home, Calendar, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div className="h-screen bg-card p-4 flex flex-col border-r">
      <div className="mb-8">
        <h2 className="text-lg font-semibold px-4 mb-4">Karaoke Admin</h2>
      </div>

      <nav className="space-y-2 flex-1">
        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/admin")}>
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          Calendrier
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
      </nav>

      <div className="border-t pt-4">
        <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};