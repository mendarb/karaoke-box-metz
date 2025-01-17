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
      <Sheet>
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

            <SheetTrigger asChild>
              <button className={getItemStyle("/account")}>
                <User2 className="w-6 h-6" />
                <span className="text-xs font-medium">Profil</span>
              </button>
            </SheetTrigger>

            {isAdmin && (
              <Link to="/admin" className={getItemStyle("/admin")}>
                <Settings className="w-6 h-6" />
                <span className="text-xs font-medium">Admin</span>
              </Link>
            )}
          </div>
        </nav>

        <SheetContent side="right" className="w-[300px] sm:w-[400px] px-0">
          <div className="h-full flex flex-col">
            <div className="flex-1 px-6">
              <div className="py-6 space-y-4">
                <Link 
                  to="/account"
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
                >
                  <User2 className="w-5 h-5" />
                  <span>Mon compte</span>
                </Link>
                <Link 
                  to="/account/my-bookings"
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Mes réservations</span>
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin"
                    className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Administration</span>
                  </Link>
                )}
              </div>
            </div>
            <div className="border-t px-6 py-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Se déconnecter
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
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