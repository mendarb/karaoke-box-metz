import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export const DesktopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBookingClick = () => {
    // Réinitialiser le stockage de session pour une nouvelle réservation
    sessionStorage.removeItem("savedBooking");
    // Rediriger vers la page d'accueil avec un état frais
    navigate('/', { replace: true });
  };

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Button
        onClick={handleBookingClick}
        size="lg"
        className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-violet-200"
      >
        <Calendar className="w-5 h-5" />
        Réserver une séance
      </Button>
      <Link to="/account" className={`text-gray-800 hover:text-violet-600 ${location.pathname === '/account' ? 'font-bold' : ''}`}>
        Mon Compte
      </Link>
      <Link to="/my-bookings" className={`text-gray-800 hover:text-violet-600 ${location.pathname === '/my-bookings' ? 'font-bold' : ''}`}>
        Mes Réservations
      </Link>
    </nav>
  );
};
