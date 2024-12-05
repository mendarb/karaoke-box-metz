import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { LogOut, UserRound } from "lucide-react";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsAdmin(user?.email === "mendar.bouchali@gmail.com");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === "mendar.bouchali@gmail.com");
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vous déconnecter. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="h-16" /> {/* Spacer pour compenser la navbar fixed */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/ca07e869-5579-405d-a730-cbd5aeb68818.png"
                alt="Karaoké Salle Privative"
                className="h-8 sm:h-12"
              />
            </Link>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="hidden sm:flex">
                        Administration
                      </Button>
                    </Link>
                  )}
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                    <UserRound className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <UserRound className="h-4 w-4" />
                    <span className="hidden sm:inline">Connexion</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};