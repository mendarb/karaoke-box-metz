import { useState, useEffect } from "react";
import { BookingForm } from "@/components/BookingForm";
import { AuthModal } from "@/components/auth/AuthModal";
import { Navbar } from "@/components/navigation/Navbar";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

const Index = () => {
  const isMobile = useIsMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Current user:", user);
        setUser(user);
        setIsAdmin(user?.email === "mendar.bouchali@gmail.com");
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === "mendar.bouchali@gmail.com");
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50">
      <Navbar />
      
      <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {isAdmin && (
            <div className="mb-6 flex justify-end">
              <Button
                onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                variant="outline"
                className="mb-4"
              >
                {showAdminDashboard ? "Voir le formulaire" : "Voir le tableau de bord"}
              </Button>
            </div>
          )}

          {isAdmin && showAdminDashboard ? (
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
      </div>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Index;