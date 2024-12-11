import { Link } from "react-router-dom";
import { Home, Calendar, User as UserIcon } from "lucide-react";

interface MobileNavProps {
  user: any;
  onSignOut: () => Promise<void>;
  onShowAuth: () => void;
}

export const MobileNav = ({ user, onSignOut, onShowAuth }: MobileNavProps) => {
  return (
    <div className="flex justify-center gap-8 md:hidden">
      <Link to="/" className="text-gray-600 hover:text-violet-600 flex flex-col items-center">
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Accueil</span>
      </Link>
      {user && (
        <Link to="/my-bookings" className="text-gray-600 hover:text-violet-600 flex flex-col items-center">
          <Calendar className="h-6 w-6" />
          <span className="text-xs mt-1">Réservations</span>
        </Link>
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