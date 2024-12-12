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
        <>
          <Link to="/my-bookings">
            <Button variant="ghost">
              Mes réservations
            </Button>
          </Link>
          <Link to="/account">
            <Button variant="ghost">
              Mon compte
            </Button>
          </Link>
        </>
      )}
      {isAdmin && (
        <Link to="/admin">
          <Button variant="ghost">
            Admin
          </Button>
        </Link>
      )}
      {user ? (
        <UserNav onSignOut={onSignOut} />
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