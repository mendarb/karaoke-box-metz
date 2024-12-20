import { Link } from "react-router-dom";
import { Home, Calendar, User as UserIcon, Settings, LayoutDashboard } from "lucide-react";

interface MobileNavProps {
  user: any;
  isAdmin: boolean;
  onSignOut: () => Promise<void>;
  onShowAuth: () => void;
}

export const MobileNav = ({ user, isAdmin, onSignOut, onShowAuth }: MobileNavProps) => {
  return (
    <div className="flex justify-center gap-6 md:hidden">
      <Link to="/" className="text-gray-600 hover:text-violet-600 flex flex-col items-center">
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Accueil</span>
      </Link>
      {user && (
        <>
          <Link to="/my-bookings" className="text-gray-600 hover:text-violet-600 flex flex-col items-center">
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Réservations</span>
          </Link>
          <Link to="/account" className="text-gray-600 hover:text-violet-600 flex flex-col items-center">
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Compte</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-gray-600 hover:text-violet-600 flex flex-col items-center">
              <LayoutDashboard className="h-6 w-6" />
              <span className="text-xs mt-1">Admin</span>
            </Link>
          )}
        </>
      )}
      {user ? (
        <button
          onClick={onSignOut}
          className="text-gray-600 hover:text-violet-600 flex flex-col items-center"
        >
          <UserIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Déconnexion</span>
        </button>
      ) : (
        <button
          onClick={onShowAuth}
          className="text-gray-600 hover:text-violet-600 flex flex-col items-center"
        >
          <UserIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Connexion</span>
        </button>
      )}
    </div>
  );
};