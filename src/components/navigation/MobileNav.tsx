import { Link, useLocation } from "react-router-dom";
import { CalendarPlus, Calendar, User2, Settings, LogOut } from "lucide-react";
import { MobileNavProps } from "@/types/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const MobileNav = ({ user, isAdmin, onSignOut, onShowAuth }: MobileNavProps) => {
  const location = useLocation();
  const isBookingFlow = location.pathname === "/booking";
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await onSignOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    }
  };

  if (isBookingFlow) {
    return null;
  }

  const getItemStyle = (path: string) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center gap-1 py-2 px-4 ${
      isActive ? "text-violet-600" : "text-gray-500"
    } transition-colors duration-200`;
  };

  if (user) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-50">
        <div className="flex justify-around items-center py-2">
          <Link 
            to="/" 
            className="flex flex-col items-center gap-1 py-2 px-4 bg-kbox-coral text-white hover:bg-kbox-orange-dark rounded-xl shadow-lg transition-all duration-200"
          >
            <CalendarPlus className="w-6 h-6" />
            <span className="text-xs font-semibold">Réserver</span>
          </Link>

          <Link 
            to="/account/my-bookings" 
            className={getItemStyle("/account/my-bookings")}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Mes résa.</span>
          </Link>

          <Link 
            to="/account" 
            className={getItemStyle("/account")}
          >
            <User2 className="w-6 h-6" />
            <span className="text-xs font-medium">Profil</span>
          </Link>

          {isAdmin && (
            <Link to="/admin" className={getItemStyle("/admin")}>
              <Settings className="w-6 h-6" />
              <span className="text-xs font-medium">Admin</span>
            </Link>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-50">
      <div className="flex justify-around items-center py-2">
        <Link 
          to="/" 
          className="flex flex-col items-center gap-1 py-2 px-4 bg-kbox-coral text-white hover:bg-kbox-orange-dark rounded-xl shadow-lg transition-all duration-200"
        >
          <CalendarPlus className="w-6 h-6" />
          <span className="text-xs font-semibold">Réserver</span>
        </Link>

        <button 
          onClick={onShowAuth} 
          className={getItemStyle("/account")}
        >
          <User2 className="w-6 h-6" />
          <span className="text-xs font-medium">Connexion</span>
        </button>
      </div>
    </nav>
  );
};