import { useUserState } from "@/hooks/useUserState";
import { supabase } from "@/lib/supabase";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { Logo } from "./Logo";

interface NavbarProps {
  onShowAuth: () => void;
}

export const Navbar = ({ onShowAuth }: NavbarProps) => {
  const { user, isAdmin } = useUserState();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />
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