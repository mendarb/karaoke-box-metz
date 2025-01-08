import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";

interface DesktopNavProps {
  user: any;
  isAdmin: boolean;
  onSignOut: () => Promise<void>;
  onShowAuth: () => void;
}

export const DesktopNav = ({ user, onShowAuth }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost">
              Réserver
            </Button>
          </Link>
          <UserNav />
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