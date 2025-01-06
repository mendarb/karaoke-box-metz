import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SavedBookingsList } from "./saved-bookings/SavedBookingsList";

interface SavedBooking {
  id: string;
  date: string;
  time_slot: string;
  duration: string;
  group_size: string;
  message?: string;
  is_available?: boolean;
}

export const SavedBookingsCart = () => {
  const [savedBookings, setSavedBookings] = useState<SavedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadSavedBookings = async () => {
    try {
      setIsLoading(true);
      const { data: bookings, error } = await supabase
        .from("saved_bookings")
        .select("*")
        .is("deleted_at", null);

      if (error) throw error;

      if (bookings) {
        const bookingsWithAvailability = await Promise.all(
          bookings.map(async (booking) => {
            const { data: existingBookings } = await supabase
              .from("bookings")
              .select("*")
              .eq("date", booking.date)
              .eq("time_slot", booking.time_slot)
              .neq("status", "cancelled")
              .is("deleted_at", null);

            return {
              ...booking,
              is_available: !existingBookings?.length,
            };
          })
        );

        setSavedBookings(bookingsWithAvailability);
        
        if (bookingsWithAvailability.length > 0) {
          toast({
            title: "💡 Réservations sauvegardées",
            description: "Cliquez sur 'Continuer la réservation' pour finaliser",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos réservations sauvegardées",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSavedBookings();
    }
  }, [isOpen]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_bookings")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setSavedBookings((prev) => prev.filter((booking) => booking.id !== id));
      toast({
        title: "Succès",
        description: "Réservation supprimée",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
        variant: "destructive",
      });
    }
  };

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative hover:bg-violet-50 hover:border-violet-200"
                aria-label="Panier des réservations"
              >
                <ShoppingCart className="h-5 w-5 text-violet-600" />
                {savedBookings.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {savedBookings.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vos réservations sauvegardées</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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