import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import { CalendarPlus } from "lucide-react";

interface DesktopNavProps {
  user: any;
  isAdmin: boolean;
  onSignOut: () => Promise<void>;
  onShowAuth: () => void;
}

export const DesktopNav = ({ user, isAdmin, onSignOut, onShowAuth }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          <Link to="/account/my-bookings">
            <Button 
              variant="default"
              className="bg-kbox-coral hover:bg-kbox-orange-dark transition-all duration-200 flex items-center gap-2 px-6 py-2 rounded-full shadow-md hover:shadow-lg"
            >
              <CalendarPlus className="h-4 w-4" />
              Réserver maintenant
            </Button>
          </Link>
          <UserNav onSignOut={onSignOut} isAdmin={isAdmin} />
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={onShowAuth}
          className="border-violet-200 hover:bg-violet-50"
        >
          Se connecter
        </Button>
      )}
    </div>
  );
};