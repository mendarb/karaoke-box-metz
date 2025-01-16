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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 md:hidden z-50">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center gap-1">
          <Home className="h-5 w-5 text-kbox-coral" />
          <span className="text-xs text-gray-600">Accueil</span>
        </Link>
        {user ? (
          <>
            <Link to="/account/my-bookings" className="flex flex-col items-center gap-1">
              <Calendar className="h-5 w-5 text-kbox-coral" />
              <span className="text-xs text-gray-600">Réservations</span>
            </Link>
            <Link to="/account" className="flex flex-col items-center gap-1">
              <Settings className="h-5 w-5 text-kbox-coral" />
              <span className="text-xs text-gray-600">Compte</span>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex flex-col items-center gap-1">
                <LayoutDashboard className="h-5 w-5 text-kbox-coral" />
                <span className="text-xs text-gray-600">Admin</span>
              </Link>
            )}
            <button
              onClick={onSignOut}
              className="flex flex-col items-center gap-1"
            >
              <UserIcon className="h-5 w-5 text-kbox-coral" />
              <span className="text-xs text-gray-600">Déconnexion</span>
            </button>
          </>
        ) : (
          <button
            onClick={onShowAuth}
            className="flex flex-col items-center gap-1"
          >
            <UserIcon className="h-5 w-5 text-kbox-coral" />
            <span className="text-xs text-gray-600">Connexion</span>
          </button>
        )}
      </div>
    </div>
  );
};