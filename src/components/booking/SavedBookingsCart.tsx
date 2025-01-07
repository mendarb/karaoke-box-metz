import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SavedBookingsList } from "./saved-bookings/SavedBookingsList";
import { CartButton } from "./saved-bookings/CartButton";
import { useSavedBookings } from "./saved-bookings/hooks/useSavedBookings";

export const SavedBookingsCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { savedBookings, isLoading, handleDelete } = useSavedBookings(isOpen);

  const handleContinueBooking = async (booking: any) => {
    try {
      // Vérifier la disponibilité avant de continuer
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', booking.date)
        .eq('time_slot', booking.time_slot)
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (existingBookings && existingBookings.length > 0) {
        toast({
          title: "Créneau indisponible",
          description: "Ce créneau n'est plus disponible",
          variant: "destructive",
        });
        return;
      }

      // Sauvegarder les données de réservation dans sessionStorage
      const bookingData = {
        ...booking,
        currentStep: 3
      };
      
      console.log("📦 Données de réservation sauvegardées:", bookingData);
      sessionStorage.setItem("savedBooking", JSON.stringify(bookingData));
      
      // Fermer le panier et rediriger
      setIsOpen(false);
      navigate("/");

    } catch (error) {
      console.error("❌ Erreur lors de la vérification:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

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