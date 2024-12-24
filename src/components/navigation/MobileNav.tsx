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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-4 md:hidden">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center">
          <Home className="h-5 w-5 text-gray-600" />
          <span className="text-xs mt-1 text-gray-600">Accueil</span>
        </Link>
        {user && (
          <>
            <Link to="/my-bookings" className="flex flex-col items-center">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">Réservations</span>
            </Link>
            <Link to="/account" className="flex flex-col items-center">
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="text-xs mt-1 text-gray-600">Compte</span>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex flex-col items-center">
                <LayoutDashboard className="h-5 w-5 text-gray-600" />
                <span className="text-xs mt-1 text-gray-600">Admin</span>
              </Link>
            )}
          </>
        )}
        {user ? (
          <button
            onClick={onSignOut}
            className="flex flex-col items-center"
          >
            <UserIcon className="h-5 w-5 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Déconnexion</span>
          </button>
        ) : (
          <button
            onClick={onShowAuth}
            className="flex flex-col items-center"
          >
            <UserIcon className="h-5 w-5 text-gray-600" />
            <span className="text-xs mt-1 text-gray-600">Connexion</span>
          </button>
        )}
      </div>
    </div>
  );
};