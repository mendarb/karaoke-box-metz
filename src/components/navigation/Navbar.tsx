import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AuthModal } from "@/components/auth/AuthModal";
import { supabase } from "@/lib/supabase";
import { useUserState } from "@/hooks/useUserState";
import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";
import { Logo } from "./Logo";

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
            <Logo />
            <MobileNav 
              user={user}
              onSignOut={handleSignOut}
              onShowAuth={() => setShowAuthModal(true)}
            />
            <DesktopNav 
              user={user}
              isAdmin={isAdmin}
              onSignOut={handleSignOut}
              onShowAuth={() => setShowAuthModal(true)}
            />
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