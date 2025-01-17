import { Link } from "react-router-dom";
import { Home, Calendar, User2, Settings } from "lucide-react";
import { MobileNavProps } from "@/types/navigation";

export const MobileNav = ({ user, isAdmin, onSignOut, onShowAuth }: MobileNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 md:hidden z-[100] pb-safe">
      <div className="flex justify-around items-center max-w-lg mx-auto px-4">
        <Link to="/" className="flex flex-col items-center gap-1">
          <Home className="h-5 w-5 text-gray-400" />
          <span className="text-xs text-gray-400">Accueil</span>
        </Link>
        
        <Link to="/bookings" className="flex flex-col items-center gap-1">
          <Calendar className="h-5 w-5 text-violet-600" />
          <span className="text-xs text-violet-600">Réserver</span>
        </Link>

        {user ? (
          <Link to="/account" className="flex flex-col items-center gap-1">
            <User2 className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Profil</span>
          </Link>
        ) : (
          <button onClick={onShowAuth} className="flex flex-col items-center gap-1">
            <User2 className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Profil</span>
          </button>
        )}

        {isAdmin && (
          <Link to="/admin" className="flex flex-col items-center gap-1">
            <Settings className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Réglages</span>
          </Link>
        )}
      </div>
    </div>
  );
};