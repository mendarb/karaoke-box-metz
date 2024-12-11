import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      {isAdmin && (
        <Link to="/admin">
          <Button variant="ghost">
            Admin
          </Button>
        </Link>
      )}
      {user ? (
        <Button
          variant="outline"
          onClick={onSignOut}
          className="border-violet-200 hover:bg-violet-50"
        >
          Se déconnecter
        </Button>
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