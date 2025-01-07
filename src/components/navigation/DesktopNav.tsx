import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, LogIn, UserPlus } from "lucide-react";
import { useUserState } from "@/hooks/useUserState";

interface DesktopNavProps {
  onShowAuth: () => void;
}

export const DesktopNav = ({ onShowAuth }: DesktopNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserState();

  const handleBookingClick = () => {
    sessionStorage.removeItem("savedBooking");
    navigate('/', { replace: true });
  };

  return (
    <nav className="flex items-center space-x-6">
      {user ? (
        <>
          <Link to="/account" className={`text-gray-800 hover:text-violet-600 ${location.pathname === '/account' ? 'font-bold' : ''}`}>
            Mon Compte
          </Link>
          <Link to="/my-bookings" className={`text-gray-800 hover:text-violet-600 ${location.pathname === '/my-bookings' ? 'font-bold' : ''}`}>
            Mes Réservations
          </Link>
          <Button
            onClick={handleBookingClick}
            size="lg"
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-violet-200"
          >
            <Calendar className="w-5 h-5" />
            Réserver une séance
          </Button>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <Button
            onClick={onShowAuth}
            variant="outline"
            size="lg"
            className="font-medium px-6 py-2 rounded-full transition-all duration-200 flex items-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Se connecter
          </Button>
          <Button
            onClick={onShowAuth}
            size="lg"
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-violet-200"
          >
            <UserPlus className="w-5 h-5" />
            S'inscrire
          </Button>
        </div>
      )}
    </nav>
  );
};