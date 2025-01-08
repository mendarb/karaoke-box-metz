import { useUserState } from "@/hooks/useUserState";
import { supabase } from "@/lib/supabase";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { Logo } from "./Logo";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { AdminDashboardButton } from "../admin/AdminDashboardButton";

interface NavbarProps {
  onShowAuth: () => void;
}

export const Navbar = ({ onShowAuth }: NavbarProps) => {
  const { user, isAdmin } = useUserState();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          {isAdmin && <AdminDashboardButton />}
          <DesktopNav
            user={user}
            isAdmin={isAdmin}
            onSignOut={handleSignOut}
            onShowAuth={onShowAuth}
          />
          <MobileNav
            user={user}
            isAdmin={isAdmin}
            onSignOut={handleSignOut}
            onShowAuth={onShowAuth}
          />
        </div>
      </div>
    </nav>
  );
};