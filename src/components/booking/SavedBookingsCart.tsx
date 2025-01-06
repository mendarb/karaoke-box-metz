import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react"; // Fixed import
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SavedBookingsList } from "./saved-bookings/SavedBookingsList";
import { CartButton } from "./saved-bookings/CartButton";
import { useSavedBookings } from "./saved-bookings/hooks/useSavedBookings";
import { SavedBooking } from "./saved-bookings/hooks/useSavedBookings";

export const SavedBookingsCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { savedBookings, isLoading, handleDelete } = useSavedBookings(isOpen);

  const handleContinueBooking = (booking: SavedBooking) => {
    if (!booking.is_available) {
      toast({
        title: "Créneau indisponible",
        description: "Ce créneau n'est plus disponible",
        variant: "destructive",
      });
      return;
    }

    sessionStorage.setItem("savedBooking", JSON.stringify({
      ...booking,
      currentStep: 3
    }));
    
    setIsOpen(false);
    navigate("/");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <CartButton count={savedBookings.length} />

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Réservations sauvegardées
          </SheetTitle>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
          </div>
        ) : (
          <SavedBookingsList
            bookings={savedBookings}
            onDelete={handleDelete}
            onContinue={handleContinueBooking}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};