import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";

interface DesktopNavProps {
  user: any;
  isAdmin: boolean;
  onSignOut: () => Promise<void>;
  onShowAuth: () => void;
}

export const DesktopNav = ({ user, isAdmin, onSignOut, onShowAuth }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center gap-4">
      {user && (
        <Link to="/my-bookings">
          <Button variant="ghost">
            Mes réservations
          </Button>
        </Link>
      )}
      {user ? (
        <UserNav onSignOut={onSignOut} isAdmin={isAdmin} />
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