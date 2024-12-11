import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";
import { Menu, X, Home, Calendar, User as UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUserState } from "@/hooks/useUserState";

export const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      setIsMenuOpen(false);
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 md:relative md:border-t-0 md:border-b md:py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo - visible on all screens */}
            <Link to="/" className="text-xl font-bold text-violet-600 hover:text-violet-700 md:flex-1">
              Karaoké Box
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