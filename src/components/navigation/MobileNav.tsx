import { Link, useLocation } from "react-router-dom";
import { CalendarPlus, Calendar, User2, Settings } from "lucide-react";
import { MobileNavProps } from "@/types/navigation";

export const MobileNav = ({ user, isAdmin, onSignOut, onShowAuth }: MobileNavProps) => {
  const location = useLocation();
  const isBookingFlow = location.pathname === "/booking";

  // Ne pas afficher la navigation pendant le flux de réservation
  if (isBookingFlow) {
    return null;
  }

  const getItemStyle = (path: string) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center gap-1 py-2 px-4 ${
      isActive ? "text-violet-600" : "text-gray-500"
    } transition-colors duration-200`;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-50">
      <div className="flex justify-around items-center py-2 relative">
        <Link 
          to="/" 
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-1 
                     w-16 h-16 bg-kbox-coral text-white hover:bg-kbox-orange-dark rounded-full shadow-lg 
                     transition-all duration-200"
        >
          <CalendarPlus className="w-7 h-7" />
          <span className="text-xs font-semibold">Réserver</span>
        </Link>

        <Link 
          to="/account/my-bookings" 
          className={getItemStyle("/account/my-bookings")}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs font-medium">Mes résa.</span>
        </Link>

        {user ? (
          <Link to="/account" className={getItemStyle("/account")}>
            <User2 className="w-6 h-6" />
            <span className="text-xs font-medium">Profil</span>
          </Link>
        ) : (
          <button onClick={onShowAuth} className={getItemStyle("/account")}>
            <User2 className="w-6 h-6" />
            <span className="text-xs font-medium">Profil</span>
          </button>
        )}

        {isAdmin && (
          <Link to="/admin" className={getItemStyle("/admin")}>
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
};