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
      console.log('🔄 Vérification de la disponibilité pour:', booking);
      
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', booking.date)
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .eq('payment_status', 'paid');

      if (checkError) {
        throw checkError;
      }

      // Vérifier les chevauchements de créneaux
      const isSlotAvailable = !existingBookings?.some(existingBooking => {
        const savedStart = parseInt(booking.time_slot);
        const savedEnd = savedStart + parseInt(booking.duration);
        const existingStart = parseInt(existingBooking.time_slot);
        const existingEnd = existingStart + parseInt(existingBooking.duration);

        return (
          (savedStart >= existingStart && savedStart < existingEnd) ||
          (savedEnd > existingStart && savedEnd <= existingEnd) ||
          (savedStart <= existingStart && savedEnd >= existingEnd)
        );
      });

      if (!isSlotAvailable) {
        toast({
          title: "Créneau indisponible",
          description: "Ce créneau n'est plus disponible",
          variant: "destructive",
        });
        return;
      }

      // Préparer les données de réservation
      const bookingData = {
        date: booking.date,
        timeSlot: booking.time_slot,
        duration: booking.duration,
        groupSize: booking.group_size,
        message: booking.message || "",
        currentStep: 3,
        cabin: booking.cabin || 'metz'
      };
      
      console.log("📦 Données de réservation à sauvegarder:", bookingData);
      
      // Sauvegarder dans sessionStorage
      sessionStorage.setItem("savedBooking", JSON.stringify(bookingData));
      
      // Fermer le panier
      setIsOpen(false);
      
      // Rediriger avec les données
      navigate("/", { 
        state: { 
          savedBooking: bookingData,
          fromSavedBookings: true 
        },
        replace: true 
      });

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