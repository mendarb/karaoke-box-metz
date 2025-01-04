import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { UserNav } from "./UserNav";
import { useUserState } from "@/hooks/useUserState";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import { useAdminCheck } from "@/hooks/useAdminCheck";

export const Navbar = () => {
  const { user } = useUserState();
  const { handleSignOut } = useAuthHandlers();
  const { isAdmin } = useAdminCheck();

  return (
    <nav className="border-b bg-white/75 backdrop-blur-lg fixed w-full z-50">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="mr-8">
          <Logo />
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          {!user && (
            <Link to="/">
              <Button 
                size="lg"
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 text-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Réserver
              </Button>
            </Link>
          )}
          <UserNav onSignOut={handleSignOut} isAdmin={isAdmin} />
        </div>
      </div>
    </nav>
  );
};