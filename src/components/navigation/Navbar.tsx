import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        if (error.message.includes("session_not_found")) {
          // Si la session est déjà invalide, on nettoie juste l'état local
          setUser(null);
          setShowAuthModal(true);
        } else {
          throw error;
        }
      } else {
        setUser(null);
        setShowAuthModal(true);
      }
    } catch (error: any) {
      console.error("Sign out error:", error);
      // En cas d'erreur, on force la déconnexion locale
      setUser(null);
      setShowAuthModal(true);
      toast({
        title: "Note",
        description: "Vous avez été déconnecté",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-violet-600">
              Karaoké Box
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                {isLoading ? "Déconnexion..." : "Se déconnecter"}
              </Button>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
              >
                Se connecter
              </Button>
            )}
          </div>
        </div>
      </div>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </nav>
  );
};