import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";

export const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session fetch error:", error);
        setUser(null);
        return;
      }
      setUser(session?.user || null);
    } catch (error) {
      console.error("Auth error:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setUser(session?.user || null);
      
      if (event === 'SIGNED_IN') {
        setShowAuthModal(false);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      setUser(null);
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
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-violet-600 hover:text-violet-700">
                Karaoké Box
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <Link to="/my-bookings" className="text-gray-600 hover:text-violet-600">
                  <Button variant="ghost">
                    Mes réservations
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