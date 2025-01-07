import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SavedBookingsList } from "./SavedBookingsList";
import { CartButton } from "./CartButton";
import { useSavedBookings } from "./hooks/useSavedBookings";

export const SavedBookingsCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { savedBookings, isLoading, handleDelete } = useSavedBookings(isOpen);

  const handleContinueBooking = useCallback(async (booking: any) => {
    try {
      const bookingData = {
        date: booking.date,
        timeSlot: booking.time_slot,
        duration: booking.duration,
        groupSize: booking.group_size,
        message: booking.message || "",
        currentStep: 3,
        cabin: booking.cabin || 'metz'
      };

      sessionStorage.setItem("savedBooking", JSON.stringify(bookingData));
      setIsOpen(false);

      // Utiliser un délai pour s'assurer que le Sheet est fermé avant la navigation
      setTimeout(() => {
        navigate("/", { 
          state: { 
            savedBooking: bookingData,
            fromSavedBookings: true 
          },
          replace: true 
        });
      }, 100);

    } catch (error) {
      console.error("❌ Erreur lors de la reprise de la réservation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <CartButton count={savedBookings.length} />
      </SheetTrigger>

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