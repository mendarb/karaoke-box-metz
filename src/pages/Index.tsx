import { useState, useEffect } from "react";
import { BookingForm } from "@/components/BookingForm";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const Index = () => {
  const isMobile = useIsMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Vérifier l'état de connexion initial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === "mendar.bouchali@gmail.com");
    });

    // Écouter les changements d'état de connexion
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === "mendar.bouchali@gmail.com");
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setShowAuthModal(true)}
              variant="outline"
              className="bg-white"
            >
              Se connecter
            </Button>
          )}
          <img 
            src="/lovable-uploads/59d9c366-5156-416c-a63a-8ab38e3fe556.png" 
            alt="Kara-OK Box Privatif"
            className="h-10 sm:h-12 drop-shadow-lg"
          />
        </div>

        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <>
            <div className="mb-6 sm:mb-8 animate-fadeIn">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Réservez votre box karaoké
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-lg">
                Indiquez vos préférences pour réserver votre cabine de karaoké privatif à Metz.
              </p>
            </div>
            <div className={`bg-white/70 backdrop-blur-sm shadow-2xl rounded-3xl ${isMobile ? 'p-4' : 'p-6 sm:p-8'} border border-violet-100/50`}>
              <BookingForm />
            </div>
          </>
        )}
      </div>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Index;