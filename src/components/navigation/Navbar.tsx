import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (error.message.includes("session_not_found")) {
          setUser(null);
          setShowAuthModal(true);
        } else {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la déconnexion.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Sign out error:", error);
      setUser(null);
      setShowAuthModal(true);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};
