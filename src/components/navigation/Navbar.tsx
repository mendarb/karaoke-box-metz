import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { UserNav } from "./UserNav";
import { useUserState } from "@/hooks/useUserState";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { CalendarDays } from "lucide-react";

export const Navbar = () => {
  const { user } = useUserState();
  const { handleSignOut } = useAuthHandlers();
  const { isAdmin } = useAdminCheck();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <nav className="border-b bg-white/75 backdrop-blur-lg fixed w-full z-50">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="mr-8">
          <Logo />
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/">
                <Button 
                  variant="default"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-2 text-sm flex items-center gap-2 shadow-sm hover:shadow transition-all duration-200"
                >
                  <CalendarDays className="w-4 h-4" />
                  Réserver une session
                </Button>
              </Link>
              <UserNav onSignOut={handleSignOut} isAdmin={isAdmin} />
            </>
          ) : (
            <Button
              onClick={() => setShowAuthModal(true)}
              variant="outline"
              className="border-violet-200 hover:bg-violet-50"
            >
              Se connecter
            </Button>
          )}
        </div>
      </div>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </nav>
  );
};