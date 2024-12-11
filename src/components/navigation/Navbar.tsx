import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";
import { Home, Calendar, User as UserIcon } from "lucide-react";
import { useUserState } from "@/hooks/useUserState";

export const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();
  const { user, isAdmin } = useUserState();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 md:relative md:border-t-0 md:border-b md:py-4 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo - different versions for mobile and desktop */}
            <Link to="/" className="flex-1">
              <div className="hidden md:block text-xl font-bold text-violet-600 hover:text-violet-700">
                Karaoké Box
              </div>
              <div className="md:hidden">
                <img 
                  src="/lovable-uploads/d45fd1b9-de1b-40a3-ae6b-4072948883a6.png" 
                  alt="Karaoké Box" 
                  className="h-8 w-8"
                />
              </div>
            </Link>

            {/* Mobile Navigation */}
            <div className="flex justify-center gap-8 md:hidden">
              <Link to="/" className="text-gray-600 hover:text-violet-600 flex flex-col items-center">
                <Home className="h-6 w-6" />
                <span className="text-xs mt-1">Accueil</span>
              </Link>
              {user && (
                <Link to="/my-bookings" className="text-gray-600 hover:text-violet-600 flex flex-col items-center">
                  <Calendar className="h-6 w-6" />
                  <span className="text-xs mt-1">Réservations</span>
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-violet-600 flex flex-col items-center"
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="text-xs mt-1">Déconnexion</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-gray-600 hover:text-violet-600 flex flex-col items-center"
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="text-xs mt-1">Connexion</span>
                </button>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {user && (
                <Link to="/my-bookings">
                  <Button variant="ghost">
                    Mes réservations
                  </Button>
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost">
                    Admin
                  </Button>
                </Link>
              )}
              {user ? (
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="border-violet-200 hover:bg-violet-50"
                >
                  Se déconnecter
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowAuthModal(true)}
                  className="border-violet-200 hover:bg-violet-50"
                >
                  Se connecter
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};