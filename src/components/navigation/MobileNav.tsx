import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Calendar, Home, User2, CalendarDays, Settings, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserState } from "@/hooks/useUserState";
import { SavedBookingsCart } from "@/components/booking/saved-bookings/SavedBookingsCart";

interface MobileNavProps {
  onShowAuth: () => void;
}

export const MobileNav = ({ onShowAuth }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserState();

  const handleBookingClick = () => {
    setIsOpen(false);
    sessionStorage.removeItem("savedBooking");
    navigate('/', { replace: true });
  };

  return (
    <div className="md:hidden flex items-center gap-2">
      {user && <SavedBookingsCart />}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4">
            {user ? (
              <>
                <Button
                  onClick={handleBookingClick}
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-6 rounded-full transition-all duration-200 flex items-center gap-2 justify-center shadow-lg hover:shadow-violet-200"
                >
                  <Calendar className="w-5 h-5" />
                  Réserver une séance
                </Button>

                <Link to="/" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Accueil
                  </Button>
                </Link>

                <Link to="/account" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start"
                  >
                    <User2 className="mr-2 h-5 w-5" />
                    Mon compte
                  </Button>
                </Link>

                <Link to="/my-bookings" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start"
                  >
                    <CalendarDays className="mr-2 h-5 w-5" />
                    Mes réservations
                  </Button>
                </Link>

                {user.app_metadata.claims_admin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full justify-start"
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      Administration
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onShowAuth();
                  }}
                  variant="outline"
                  size="lg"
                  className="w-full justify-center font-medium px-6 py-6 rounded-full transition-all duration-200 flex items-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Se connecter
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onShowAuth();
                  }}
                  size="lg"
                  className="w-full justify-center bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-6 rounded-full transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-violet-200"
                >
                  <UserPlus className="w-5 h-5" />
                  S'inscrire
                </Button>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};